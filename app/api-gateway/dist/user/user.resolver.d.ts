import { OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './user.type';
export declare class UserResolver implements OnModuleInit {
    private readonly userClient;
    constructor(userClient: ClientProxy);
    onModuleInit(): void;
    getUser(id: number): Promise<User>;
    listUsers(): Promise<User[]>;
}
