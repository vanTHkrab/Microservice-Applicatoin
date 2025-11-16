package main

import (
	"context"
	"log"
	"net"

	"google.golang.org/grpc"

	pb "order-service-go/order-pb"
)

type server struct {
	pb.UnimplementedOrderServiceServer
}

func (s *server) GetOrder(ctx context.Context, req *pb.GetOrderRequest) (*pb.GetOrderResponse, error) {
	return &pb.GetOrderResponse{
		Id:     req.Id,
		Status: "PAID",
		Total:  199.0,
	}, nil
}

func (s *server) GetAllOrders(ctx context.Context, req *pb.GetAllOrdersRequest) (*pb.GetAllOrdersResponse, error) {
	return &pb.GetAllOrdersResponse{
		Orders: []*pb.Order{
			{Id: 1, Status: "PAID", Total: 199.0},
			{Id: 2, Status: "SHIPPED", Total: 299.0},
			{Id: 3, Status: "DELIVERED", Total: 399.0},
		},
	}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterOrderServiceServer(s, &server{})

	log.Println("Order Service (Go gRPC) running on :50051...")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
