import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CnnJob {
    @Field(() => ID)
    jobId: string;

    @Field()
    status: string;

    @Field({ nullable: true })
    createdAt?: string;

    @Field({ nullable: true })
    finishedAt?: string;

    @Field({ nullable: true })
    result?: string;
}