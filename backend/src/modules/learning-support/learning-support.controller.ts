import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LearningSupportService } from './learning-support.service';
import { CreateLearningSupportDto } from './dto/create-learning-support.dto';
import { UpdateLearningSupportDto } from './dto/update-learning-support.dto';

@Controller('learning-support')
export class LearningSupportController {
  constructor(private readonly learningSupportService: LearningSupportService) {}

  @Post()
  create(@Body() createLearningSupportDto: CreateLearningSupportDto) {
    return this.learningSupportService.create(createLearningSupportDto);
  }

  @Get()
  findAll() {
    return this.learningSupportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learningSupportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLearningSupportDto: UpdateLearningSupportDto) {
    return this.learningSupportService.update(+id, updateLearningSupportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learningSupportService.remove(+id);
  }
}
