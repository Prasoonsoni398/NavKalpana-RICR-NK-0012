import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {User} from '../../common/entities/user.entity'
import { AuthProvider } from 'src/common/entities/auth_providers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,AuthProvider]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], 
})
export class UsersModule {}
