import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GraphQLModule } from '@nestjs/graphql';
import {
    MercuriusDriver,
    MercuriusDriverConfig,
} from '@nestjs/mercurius';
import { join } from 'path';
import Redis from 'ioredis';

import { UserResolver } from './user/user.resolver';
import { OrderResolver } from './order/order.resolver';
import {ProductResolver} from "./product/product.resolver";
import {CnnJobResolver} from "./cnn/cnn-job.resolver";
import {CnnJobService} from "./cnn/cnn-job.service";

@Module({
    imports: [
        /**
         * === Microservices Clients ===
         */
        ClientsModule.register([
            /**
             * TCP Transport to User Service (NestJS)
             */
            {
                name: 'USER_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: '127.0.0.1',
                    port: 3002,
                },
            },
            /**
             * gRPC Transport to Order Service (NestJS)
             */
            {
                name: 'ORDER_SERVICE',
                transport: Transport.GRPC,
                options: {
                    package: 'order', // Ensure this matches the package name in your proto file
                    protoPath: join(__dirname, '../../../proto/order.proto'),
                    url: 'localhost:50051',
                },
            },
            /**
             * gRPC Transport to Product Service (Rust)
             */
            {
                name: 'PRODUCT_SERVICE',
                transport: Transport.GRPC,
                options: {
                    package: 'product', // Ensure this matches the package name in your proto file
                    protoPath: join(__dirname, '../../../proto/product.proto'),
                    url: 'localhost:50052',
                },
            },

            /**
             * Redis Transport to CNN FastAPI Service (Python)
             */
            {
                name: 'CNN_SERVICE',
                transport: Transport.REDIS,
                options: {
                    host: "localhost",
                    port: 6379,
                },
            }
        ]),

        /**
         * === GraphQL Module with Mercurius (Fastify) ===
         */
        GraphQLModule.forRoot<MercuriusDriverConfig>({
            driver: MercuriusDriver,
            autoSchemaFile: true,
            graphiql: true,
            path: '/graphql',
        }),
    ],
    providers: [
        // UserResolver,
        // OrderResolver,
        // ProductResolver,
        {
            provide: 'REDIS',
            useFactory: () => new Redis({
                host: 'localhost',
                port: 6379,
            }),
        },
        CnnJobResolver,
        CnnJobService,
    ],
})
export class AppModule {}
