// cnn-job.resolver.ts
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CnnJob } from './cnn-job.type';
import { CnnJobInput } from './cnn-job.input';
import { CnnJobService } from './cnn-job.service';

@Resolver(() => CnnJob)
export class CnnJobResolver {
    constructor(
        private readonly cnnJobService: CnnJobService,
    ) {}

    @Mutation(() => CnnJob, { name: 'createCnnJob' })
    async createCnnJob(
        @Args('input') input: CnnJobInput,
    ): Promise<CnnJob> {
        const { jobId } = await this.cnnJobService.enqueueJob({
            imagePath: input.imagePath,
            roi: input.roi ? JSON.parse(input.roi) : {},
            model: input.model,
        });

        return {
            jobId,
            status: 'queued',
            createdAt: new Date().toISOString(),
        };
    }

    @Query(() => CnnJob, { name: 'cnnJob', nullable: true })
    async cnnJob(
        @Args('jobId') jobId: string,
    ): Promise<CnnJob | null> {
        const job = await this.cnnJobService.getJob(jobId);
        if (!job) return null;

        return {
            jobId,
            status: job.status,
            createdAt: job.created_at,
            finishedAt: job.finished_at,
            result: job.result,
        };
    }
}
