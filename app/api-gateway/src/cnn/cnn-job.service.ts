// cnn-job.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Redis } from 'ioredis';

@Injectable()
export class CnnJobService {
    constructor(
        @Inject('REDIS')
        private readonly redis: Redis,
    ) {}

    async enqueueJob(payload: {
        imagePath: string;
        roi?: any;
        model?: string;
    }) {
        const jobId = uuid();

        const data = {
            job_id: jobId,
            image_path: payload.imagePath,
            roi: JSON.stringify(payload.roi ?? {}),
            model: payload.model ?? 'default',
            created_at: new Date().toISOString(),
        };

        await this.redis.xadd(
            'cnn_jobs',
            '*',
            ...Object.entries(data).flat()
        );

        await this.redis.hset(`job:${jobId}`, {
            status: 'queued',
            created_at: data.created_at,
        });

        return { jobId };
    }

    async getJob(jobId: string) {
        const job = await this.redis.hgetall(`job:${jobId}`);
        if (!job || Object.keys(job).length === 0) {
            return null;
        }
        return job;
    }
}
