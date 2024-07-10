import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class UserRegistrationRequestGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('Websocket Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Socket connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Socket disconnect:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    console.log(client.id, payload);
    return 'Hello world!';
  }
}
