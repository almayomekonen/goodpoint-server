import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';

const allowedOrigins =
    process.env.NODE_ENV === 'production'
        ? ['https://goodpoint-client-production.up.railway.app', process.env.CLIENT_DOMAIN]
        : '*';

@WebSocketGateway({
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
})
export class TeachersGoodPointsGateway {
    @WebSocketServer()
    server: Server;

    //called when a new gp was saved , then send a notification to receiver

    handleMessage(data: { gpId: number; receiverId: string; schoolId: number }) {
        this.server.emit(`received-message/${data.receiverId}`, { gpId: data.gpId, schoolId: data.schoolId });
    }
}
