import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CnnJobInput {
    @Field()
    imagePath: string;

    @Field({ nullable: true })
    roi?: string;

    @Field({ nullable: true })
    model?: string;
}