import {Inject, OnModuleInit} from '@nestjs/common';
import {Args, Int, Query, Resolver} from '@nestjs/graphql';
import type {ClientGrpc} from '@nestjs/microservices';
import {lastValueFrom} from 'rxjs';

import {Order} from './order.type';
import {OrderServiceClient} from './order.grpc';

@Resolver(() => Order)
export class OrderResolver implements OnModuleInit {
    private orderService: OrderServiceClient;

    constructor(
        @Inject('ORDER_SERVICE')
        private readonly orderClient: ClientGrpc,
    ) {}

    onModuleInit() {
        this.orderService =
            this.orderClient.getService<OrderServiceClient>('OrderService');
    }

    @Query(() => Order, { name: 'order' })
    async getOrder(
        @Args('id', { type: () => Int }) id: number,
    ): Promise<Order> {
        const res$ = this.orderService.getOrder({ id });
        // result: GetOrderResponse
        return await lastValueFrom(res$);
    }

    @Query(() => [Order], { name: 'orders' })
    async getAllOrders(): Promise<Order[]> {
        const res$ = this.orderService.getAllOrders({});
        const { orders } = await lastValueFrom(res$);
        return orders;
    }
}
