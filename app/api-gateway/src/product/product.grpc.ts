import { Observable } from 'rxjs';
import { Product } from './product.type';

export interface GetProductRequest {
    id: number;
}

export interface GetAllProductsRequest {} // Follow proto: message GetAllProductsRequest {}

export interface GetProductResponse {
    id: number;
    name: string;
    price?: number | null;
}

export interface GetAllProductsResponse {
    products: Product[];
}

export interface ProductServiceClient {
    getProduct(data: GetProductRequest): Observable<GetProductResponse>;
    getAllProducts(data: GetAllProductsRequest): Observable<GetAllProductsResponse>;
}