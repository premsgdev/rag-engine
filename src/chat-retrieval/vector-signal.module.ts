import { Module } from '@nestjs/common';
import { VectorSignalService } from './vector-signal.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [VectorSignalService],
  exports: [VectorSignalService],
})
export class VectorSignalModule {}
