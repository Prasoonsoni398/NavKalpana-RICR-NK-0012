import { Test, TestingModule } from '@nestjs/testing';
import { StudentActivityServiceService } from './student-activity-service.service';

describe('StudentActivityServiceService', () => {
  let service: StudentActivityServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentActivityServiceService],
    }).compile();

    service = module.get<StudentActivityServiceService>(StudentActivityServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
