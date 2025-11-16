import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Product {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field(() => Float, { nullable: true })
    price?: number | null;
}