import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;
    constructor(private config: ConfigService) {}
    onModuleDestroy() {
        this.client.quit();
    }
    onModuleInit() {
        const redisUrl = this.config.get<string>('REDIS_URL');

        if (!redisUrl) {
            throw new Error('REDIS_URL is not defined');
        }
        this.client = new Redis(redisUrl);
        this.client.on('connect', () => {
            console.log('✅ Redis connected');
        });

        this.client.on('error', (err) => {
            console.error('❌ Redis error', err);
        });
    }
    getClient() {
        return this.client;
    }
}