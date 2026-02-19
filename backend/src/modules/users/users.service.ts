import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../common/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      role:'STUDENT',
      isActive:true
    });
    return await this.userRepository.save(user);
  }

  // Get all users
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // Get a single user by ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Update a user by ID
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  // Delete a user by ID
  async remove(id: number): Promise<{ deleted: boolean }> {
    const ifUser = await  this.userRepository.findOne({where:{id:id}})
    if(!ifUser)
    {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    ifUser.isActive = false
    await this.userRepository.save(ifUser)
    return { deleted: true };
  }
}
