import { Module } from '@nestjs/common';
import { IngestService } from './ingest.service';
import { AiModule } from '../ai/ai.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    AiModule,
    RedisModule,
  ],
  providers: [IngestService],
  exports: [IngestService],
})
export class IngestModule {}
