import { Module } from '@nestjs/common';
import { IngestCommand } from './ingest.command';
import { IngestModule } from './ingest.module';

@Module({
  imports: [IngestModule],
  providers: [IngestCommand],
})
export class CliModule {}
