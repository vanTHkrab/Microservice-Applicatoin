import {Inject, OnModuleInit} from '@nestjs/common';
import {Args, Int, Query, Resolver} from '@nestjs/graphql';
import {ClientProxy} from '@nestjs/microservices';
import {lastValueFrom} from 'rxjs';
import {User} from './user.type';

@Resolver(() => User)
export class UserResolver implements OnModuleInit{
    constructor(
        @Inject('USER_SERVICE')
        private readonly userClient: ClientProxy,
    ) {}

    onModuleInit() {
        this.userClient.connect();
    }

    @Query(() => User, { name: 'user' })
    async getUser(
        @Args('id', { type: () => Int }) id: number,
    ): Promise<User> {
        const result$ = this.userClient.send<User>(
            { cmd: 'get_user' },
            { id },
        );

        // Convert Observable -> Promise
        return await lastValueFrom(result$);
    }

    @Query(() => [User], { name: 'users' })
    async listUsers(): Promise<User[]> {
        const result$ = this.userClient.send<User[]>(
            { cmd: 'list_users' },
            {},
        );

        // Convert Observable -> Promise
        return await lastValueFrom(result$);
    }
}
