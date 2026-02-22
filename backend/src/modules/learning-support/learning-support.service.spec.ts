import { Test, TestingModule } from '@nestjs/testing';
import { LearningSupportService } from './learning-support.service';

describe('LearningSupportService', () => {
  let service: LearningSupportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LearningSupportService],
    }).compile();

    service = module.get<LearningSupportService>(LearningSupportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
