import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ChatService } from './chat.service';
import type { ChatRequest, ChatResponse } from './chat.types';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() request: ChatRequest): Promise<ChatResponse> {
    return this.chatService.ask(request);
  }

  @Post('stream')
  async streamChat(@Body() request: ChatRequest, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    await this.chatService.chatStream(request, (token) => {
      res.write(`data: ${token}\n\n`);
    });
    res.write('event: end\ndata: [DONE]\n\n');
    res.end();
  }
}
