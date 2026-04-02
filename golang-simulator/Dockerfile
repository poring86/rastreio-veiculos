FROM golang:alpine

WORKDIR /app

RUN apk add --no-cache git

COPY . .

RUN go mod tidy

RUN CGO_ENABLED=0 go build -o /main cmd/simulator/main.go

CMD ["/main"]

