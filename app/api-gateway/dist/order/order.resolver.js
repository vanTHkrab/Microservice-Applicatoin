"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderResolver = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const rxjs_1 = require("rxjs");
const order_type_1 = require("./order.type");
let OrderResolver = class OrderResolver {
    orderClient;
    orderService;
    constructor(orderClient) {
        this.orderClient = orderClient;
    }
    onModuleInit() {
        this.orderService =
            this.orderClient.getService('OrderService');
    }
    async getOrder(id) {
        const res$ = this.orderService.getOrder({ id });
        return await (0, rxjs_1.lastValueFrom)(res$);
    }
    async getAllOrders() {
        const res$ = this.orderService.getAllOrders({});
        const { orders } = await (0, rxjs_1.lastValueFrom)(res$);
        return orders;
    }
};
exports.OrderResolver = OrderResolver;
__decorate([
    (0, graphql_1.Query)(() => order_type_1.Order, { name: 'order' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "getOrder", null);
__decorate([
    (0, graphql_1.Query)(() => [order_type_1.Order], { name: 'orders' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "getAllOrders", null);
exports.OrderResolver = OrderResolver = __decorate([
    (0, graphql_1.Resolver)(() => order_type_1.Order),
    __param(0, (0, common_1.Inject)('ORDER_SERVICE')),
    __metadata("design:paramtypes", [Object])
], OrderResolver);
//# sourceMappingURL=order.resolver.js.map