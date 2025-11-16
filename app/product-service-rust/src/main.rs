use std::error::Error;
use tonic::{transport::Server, Request, Response, Status};

use product::product_service_server::{ProductService, ProductServiceServer};
use product::{GetProductRequest, GetProductResponse};
use crate::product::{GetAllProductsRequest, GetAllProductsResponse};

pub mod product {
    tonic::include_proto!("product");
}

#[derive(Debug, Default)]
pub struct MyProductService;

#[tonic::async_trait]
impl ProductService for MyProductService {
    async fn get_product(
        &self,
        request: Request<GetProductRequest>,
    ) -> Result<Response<GetProductResponse>, Status> {
        let req = request.into_inner();

        let response = GetProductResponse {
            id: req.id,
            name: format!("Product {}", req.id),
            price: 99.99,
        };

        Ok(Response::new(response))
    }

    async fn get_all_products(&self, request: Request<GetAllProductsRequest>) -> Result<Response<GetAllProductsResponse>, Status> {
        let _req = request.into_inner();

        let products = vec![
            product::Product {
                id: 1,
                name: "Product 1".to_string(),
                price: 49.99,
            },
            product::Product {
                id: 2,
                name: "Product 2".to_string(),
                price: 79.99,
            },
            product::Product {
                id: 3,
                name: "Product 3".to_string(),
                price: 99.99,
            },
        ];

        let response = GetAllProductsResponse { products };

        Ok(Response::new(response))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let addr = "[::1]:50052".parse()?;

    let product_service = MyProductService::default();

    println!("ProductService listening on {}", addr);

    Server::builder()
        .add_service(ProductServiceServer::new(product_service))
        .serve(addr)
        .await?;

    Ok(())
}