import { Test, TestingModule } from '@nestjs/testing';
import { LearningSupportController } from './learning-support.controller';
import { LearningSupportService } from './learning-support.service';

describe('LearningSupportController', () => {
  let controller: LearningSupportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearningSupportController],
      providers: [LearningSupportService],
    }).compile();

    controller = module.get<LearningSupportController>(LearningSupportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
