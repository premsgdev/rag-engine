import { Command, CommandRunner } from "nest-commander"
import { IngestService } from "./ingest.service"


@Command({
    name: 'ingest:documents',
    description: 'Ingest all PDFs from data/documents',
})
export class IngestCommand extends CommandRunner {
    constructor(private readonly ingestService: IngestService) {
        super()
    }   
    async run(): Promise<void> {
        console.log('IngestCommand started');
        await this.ingestService.ingestAll();
        console.log('IngestCommand finished');
    }
    
}
