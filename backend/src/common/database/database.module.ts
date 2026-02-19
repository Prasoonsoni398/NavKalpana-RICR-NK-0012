import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { readdirSync, existsSync } from 'fs';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        // Determine the folder depending on dev or dist
        const entitiesDir =
          process.env.NODE_ENV === 'dev'
            ? join(__dirname, '../entities')  // src/entities for dev
            : join(__dirname, '../entities'); // dist/entities for prod

        let entityFiles: string[] = [];
        if (existsSync(entitiesDir)) {
          entityFiles = readdirSync(entitiesDir).filter(
            (f) => f.endsWith('.entity.js') || f.endsWith('.entity.ts'),
          );
        }

        // Load entities dynamically
        const entities: Function[] = entityFiles
          .map((f) => {
            const required = require(join(entitiesDir, f));
            const entity = Object.values(required).find(v => typeof v === 'function');
            return entity;
          })
          .filter(Boolean) as Function[];

        console.log('Loaded entities:', entities.map((e) => e?.name));

        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: Number(configService.get('DB_PORT', 5432)),
          username: configService.get('DB_USER', 'postgres'),
          password: configService.get('DB_PASS', 'postgres'), 
          database: configService.get('DB_NAME', 'LMS'),
          synchronize: true,
          entities,
          ssl: configService.get('NODE_ENV') === 'prod' ? { rejectUnauthorized: false } : undefined,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
