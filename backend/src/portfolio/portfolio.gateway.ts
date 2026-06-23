import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'terminal',
})
export class PortfolioGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PortfolioGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly portfolioService: PortfolioService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    // Send welcome banner
    client.emit(
      'terminal-output',
      [
        'Bienvenido a la Terminal Interactiva de Jorge Doicela (SSH v2.0)',
        'Escribe "help" para comenzar.',
        '',
        'jorge@vps-1gb-ram:~$ ',
      ].join('\n'),
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('execute-command')
  handleCommand(
    @MessageBody() command: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Executing command from client ${client.id}: "${command}"`);

    const output = this.portfolioService.executeCommand(command);

    // Send response back
    client.emit('terminal-output', `${output}\n\njorge@vps-1gb-ram:~$ `);
  }
}
