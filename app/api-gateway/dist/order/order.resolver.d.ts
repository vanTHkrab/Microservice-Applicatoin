import { OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Order } from './order.type';
export declare class OrderResolver implements OnModuleInit {
    private readonly orderClient;
    private orderService;
    constructor(orderClient: ClientGrpc);
    onModuleInit(): void;
    getOrder(id: number): Promise<Order>;
    getAllOrders(): Promise<Order[]>;
}
