import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {

        const isDev = configService.get('NODE_ENV') === 'dev';
        return {
          type: 'postgres',

          host: configService.get('DB_HOST', 'localhost'),
          port: Number(configService.get('DB_PORT', 5432)),
          username: configService.get('DB_USER', 'postgres'),
          password: configService.get('DB_PASS', 'postgres'),
          database: configService.get('DB_NAME', 'LMS'),

          // ✅ CRITICAL FIX
          synchronize: true,

          // ✅ Much cleaner entity loading
          entities: [
            join(__dirname, '/../entities/*.entity.{js,ts}'),
          ],

          // Optional but recommended for debugging
          logging: isDev,

          ssl: configService.get('NODE_ENV') === 'prod'
            ? { rejectUnauthorized: false }
            : undefined,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
