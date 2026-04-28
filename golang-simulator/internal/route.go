package internal

import (
	"fmt"
	"math"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Directions struct {
	Lat float64 `bson:"lat" json:"lat"`
	Lng float64 `bson:"lng" json:"lng"`
}

type Route struct {
	ID         string       `bson:"_id" json:"id"`
	Distance   float64      `bson:"distance" json:"distance"`
	Directions []Directions `bson:"directions" json:"directions"`
	Freight    float64      `bson:"freight" json:"freight"`
}

func NewRoute(id string, distance float64, directions []Directions) Route {
	return Route{
		ID:         id,
		Distance:   distance,
		Directions: directions,
	}
}

type RouteService struct {
	mongo          *mongo.Client
	FreightService *FreightService
}

func NewRouteService(mongo *mongo.Client, freightService *FreightService) *RouteService {
	return &RouteService{
		mongo:          mongo,
		FreightService: freightService,
	}
}

type FreightService struct{}

func NewFreightService() *FreightService {
	return &FreightService{}
}

func (fs *FreightService) Calculate(distance float64) float64 {
	// Calcular frete: R$ 3,00 por km, mínimo R$ 150
	freight := distance * 3.0
	if freight < 150.0 {
		 freight = 150.0
	}
	// Arredondar para 2 casas decimais
	return math.Round(freight*100) / 100
}

func (rs *RouteService) CreateRoute(route Route) (Route, error) {
	freightCost := rs.FreightService.Calculate(route.Distance)
	route.Freight = freightCost
	fmt.Printf("Calculated freight cost: %.2f\n", freightCost)

	update := bson.M{
		"$set": bson.M{
			"distance":   route.Distance,
			"directions": route.Directions,
			"freight":    freightCost,
		},
	}

	filter := bson.M{"_id": route.ID}

	// Upsert option to insert if not exists
	opts := options.Update().SetUpsert(true)

	_, err := rs.mongo.Database("simulator").Collection("routes").UpdateOne(nil, filter, update, opts)

	return route, err
}

func (rs *RouteService) GetRoute(id string) (Route, error) {
	var route Route
	filter := bson.M{"_id": id}
	err := rs.mongo.Database("simulator").Collection("routes").FindOne(nil, filter).Decode(&route)
	fmt.Printf("Found route: %+v\n", route)
	return route, err
}
