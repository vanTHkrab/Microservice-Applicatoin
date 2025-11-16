"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const graphql_1 = require("@nestjs/graphql");
const mercurius_1 = require("@nestjs/mercurius");
const path_1 = require("path");
const ioredis_1 = __importDefault(require("ioredis"));
const cnn_job_resolver_1 = require("./cnn/cnn-job.resolver");
const cnn_job_service_1 = require("./cnn/cnn-job.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'USER_SERVICE',
                    transport: microservices_1.Transport.TCP,
                    options: {
                        host: '127.0.0.1',
                        port: 3002,
                    },
                },
                {
                    name: 'ORDER_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'order',
                        protoPath: (0, path_1.join)(__dirname, '../../../proto/order.proto'),
                        url: 'localhost:50051',
                    },
                },
                {
                    name: 'PRODUCT_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'product',
                        protoPath: (0, path_1.join)(__dirname, '../../../proto/product.proto'),
                        url: 'localhost:50052',
                    },
                },
                {
                    name: 'CNN_SERVICE',
                    transport: microservices_1.Transport.REDIS,
                    options: {
                        host: "localhost",
                        port: 6379,
                    },
                }
            ]),
            graphql_1.GraphQLModule.forRoot({
                driver: mercurius_1.MercuriusDriver,
                autoSchemaFile: true,
                graphiql: true,
                path: '/graphql',
            }),
        ],
        providers: [
            {
                provide: 'REDIS',
                useFactory: () => new ioredis_1.default({
                    host: 'localhost',
                    port: 6379,
                }),
            },
            cnn_job_resolver_1.CnnJobResolver,
            cnn_job_service_1.CnnJobService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map