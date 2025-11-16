import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Order {
    @Field(() => Int)
    id: number;

    @Field()
    status: string;

    @Field(() => Float, { nullable: true })
    total?: number | null;
}
