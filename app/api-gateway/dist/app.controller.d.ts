import { ClientProxy } from '@nestjs/microservices';
export declare class AppController {
    private readonly userClient;
    constructor(userClient: ClientProxy);
    getUser(): Promise<import("rxjs").Observable<any>>;
    listUsers(): Promise<import("rxjs").Observable<any>>;
}
