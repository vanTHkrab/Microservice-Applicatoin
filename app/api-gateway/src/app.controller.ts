import {Controller, Get, Inject} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';

@Controller()
export class AppController {
    constructor(
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    ) {}

    @Get('user')
    async getUser() {
        return this.userClient.send(
            {cmd: 'get_user'},
            {id: 1}
        );
    }

    @Get('users')
    async listUsers() {
        return this.userClient.send(
            {cmd: 'list_users'},
            {id: 1}
        );
    }
}
