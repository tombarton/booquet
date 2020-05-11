import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { SocketGuard } from 'src/guards/socket-guard';

@UseGuards(SocketGuard)
@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  // Example message, we're not actually using this.
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }
}
