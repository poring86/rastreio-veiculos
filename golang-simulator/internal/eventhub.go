package internal

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/mongo"
)

type EventHub struct {
	routeService        *RouteService
	mongoClient         *mongo.Client
	chDriverMoved       chan *DriverMovedEvent
	chFreightCalculated chan *FreightCalculatedEvent
	freightWriter       *kafka.Writer
	simulationWriter    *kafka.Writer
}

func NewEventHub(
	routeService *RouteService,
	mongoClient *mongo.Client,
	chDriverMoved chan *DriverMovedEvent,
	chFreightCalculated chan *FreightCalculatedEvent,
	freightWriter *kafka.Writer,
	simulationWriter *kafka.Writer,
) *EventHub {
	return &EventHub{
		routeService:        routeService,
		mongoClient:         mongoClient,
		chDriverMoved:       chDriverMoved,
		chFreightCalculated: chFreightCalculated,
		freightWriter:       freightWriter,
		simulationWriter:    simulationWriter,
	}
}

func (eh *EventHub) HandleEvent(msg []byte) error {
	var baseEvent struct {
		EventName string `json:"event"`
	}

	if err := json.Unmarshal(msg, &baseEvent); err != nil {
		return fmt.Errorf("error unmarshaling base event: %w", err)
	}

	switch baseEvent.EventName {
	case "RouteCreated":
		fmt.Printf("Received RouteCreated event\n")
		var event RouteCreatedEvent
		if err := json.Unmarshal(msg, &event); err != nil {
			return fmt.Errorf("error unmarshaling RouteCreatedEvent: %w", err)
		}
		return eh.handleRouteCreated(event)

	case "DeliveryStarted":
		fmt.Printf("Received DeliveryStarted event for route: %s\n", msg)
		var event DeliveryStartedEvent
		if err := json.Unmarshal(msg, &event); err != nil {
			return fmt.Errorf("error unmarshaling DeliveryStartedEvent: %w", err)
		}
		return eh.handleDeliveryStarted(event)

	default:
		fmt.Printf("Unknown event received: %s\n", baseEvent.EventName)
		return errors.New("unknown event type")
	}
}

func (eh *EventHub) handleRouteCreated(event RouteCreatedEvent) error {
	freightCalculatedEvent, err := RouteCreatedHandler(&event, eh.routeService, eh.mongoClient)
	if err != nil {
		return err
	}
	fmt.Printf("FreightCalculatedEvent created: %+v\n", freightCalculatedEvent)

	value, _ := json.Marshal(freightCalculatedEvent)
	if err := eh.freightWriter.WriteMessages(context.Background(), kafka.Message{
		Key:   []byte(freightCalculatedEvent.RouteID),
		Value: value,
	}); err != nil {
		fmt.Printf("Error producing FreightCalculatedEvent: %v\n", err)
	}
	return nil
}

func (eh *EventHub) handleDeliveryStarted(event DeliveryStartedEvent) error {
	err := DeliveryStartedHandler(&event, eh.routeService, eh.mongoClient, eh.chDriverMoved)
	if err != nil {
		return err
	}

	go func() {
		for movedEvent := range eh.chDriverMoved {
			value, _ := json.Marshal(movedEvent)
			if err := eh.simulationWriter.WriteMessages(context.Background(), kafka.Message{
				Key:   []byte(movedEvent.RouteID),
				Value: value,
			}); err != nil {
				fmt.Printf("Error producing DriverMovedEvent: %v\n", err)
			}
		}
	}()

	return nil
}
