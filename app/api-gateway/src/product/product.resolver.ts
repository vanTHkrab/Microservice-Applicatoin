import {Inject, OnModuleInit} from "@nestjs/common";
import {Args, Int, Query, Resolver} from "@nestjs/graphql";
import type {ClientGrpc} from "@nestjs/microservices";
import {lastValueFrom} from "rxjs";

import {Product} from "./product.type";
import {ProductServiceClient} from "./product.grpc";

@Resolver(() => Product)
export class ProductResolver implements OnModuleInit {
    private productService: ProductServiceClient;

    constructor(
        @Inject("PRODUCT_SERVICE")
        private readonly productClient: ClientGrpc,
    ) {}

    onModuleInit() {
        this.productService =
            this.productClient.getService<ProductServiceClient>(
                "ProductService",
            );
    }

    @Query(() => Product, { name: "product" })
    async getProduct(
        @Args("id", { type: () => Int }) id: number,
    ): Promise<Product> {
        const res$ = this.productService.getProduct({ id });
        // result: GetProductResponse
        return await lastValueFrom(res$);
    }

    @Query(() => [Product], { name: "products" })
    async getAllProducts(): Promise<Product[]> {
        const res$ = this.productService.getAllProducts({});
        const { products } = await lastValueFrom(res$);
        return products;
    }
}