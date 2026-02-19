import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { readdirSync } from 'fs';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        const entitiesDir = join(__dirname, '../entities');
        const entityFiles = readdirSync(entitiesDir).filter(
          (f) => f.endsWith('.entity.ts') || f.endsWith('.entity.js'),
        );

        const entities: Function[] = entityFiles
          .map((f) => require(join(entitiesDir, f)))
          .map((mod) => Object.values(mod)[0] as Function);

        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: Number(configService.get('DB_PORT', 5432)),
          username: configService.get('DB_USER', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_NAME', 'LMS'),
          synchronize: true,  
          entities,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
