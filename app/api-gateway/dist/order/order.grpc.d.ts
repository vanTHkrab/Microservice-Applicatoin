import { Observable } from 'rxjs';
import { Order } from './order.type';
export interface GetOrderRequest {
    id: number;
}
export interface GetAllOrdersRequest {
}
export interface GetOrderResponse {
    id: number;
    status: string;
    total: number;
}
export interface GetAllOrdersResponse {
    orders: Order[];
}
export interface OrderServiceClient {
    getOrder(data: GetOrderRequest): Observable<GetOrderResponse>;
    getAllOrders(data: GetAllOrdersRequest): Observable<GetAllOrdersResponse>;
}
