import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
    @MessagePattern({ cmd: 'get_user' })
    getUser(data: { id: number }) {
        return { id: data.id, name: "John Doe", role: "admin" };
    }

    @MessagePattern({ cmd: 'list_users' })
    listUsers() {
        return [
            { id: 1, name: "John Doe", role: "admin" },
            { id: 2, name: "Jane Smith", role: "user" },
        ];
    }
}
