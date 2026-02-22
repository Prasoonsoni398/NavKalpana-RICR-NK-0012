import { Injectable } from '@nestjs/common';
import { CreateLearningSupportDto } from './dto/create-learning-support.dto';
import { UpdateLearningSupportDto } from './dto/update-learning-support.dto';

@Injectable()
export class LearningSupportService {
  create(createLearningSupportDto: CreateLearningSupportDto) {
    return 'This action adds a new learningSupport';
  }

  findAll() {
    return `This action returns all learningSupport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} learningSupport`;
  }

  update(id: number, updateLearningSupportDto: UpdateLearningSupportDto) {
    return `This action updates a #${id} learningSupport`;
  }

  remove(id: number) {
    return `This action removes a #${id} learningSupport`;
  }
}
