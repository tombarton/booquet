import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketGuard extends AuthGuard('socket') {
  handleRequest(err: Error, user: any) {
    if (!user || err) {
      throw new WsException('Unauthorized');
    }
    return user;
  }
}
