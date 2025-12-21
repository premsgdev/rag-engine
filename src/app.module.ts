import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { IngestCommand } from './cli/ingest.command';
import { IngestService } from './cli/ingest.service';
import { AiModule } from './ai/ai.module';
import { CliModule } from './cli/cli.module';
import { ChatModule } from './chat/chat.module';
import { ChatController } from './chat/chat.controller';
import { VectorSignalModule } from './chat-retrieval/vector-signal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    AiModule,
    CliModule,
    ChatModule,
    VectorSignalModule,
  ],
  controllers: [AppController, ChatController],
  providers: [AppService, IngestCommand, IngestService],
})
export class AppModule {}
