import { Test, TestingModule } from '@nestjs/testing';
import { StudentActivityServiceController } from './student-activity-service.controller';
import { StudentActivityServiceService } from './student-activity-service.service';

describe('StudentActivityServiceController', () => {
  let controller: StudentActivityServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentActivityServiceController],
      providers: [StudentActivityServiceService],
    }).compile();

    controller = module.get<StudentActivityServiceController>(StudentActivityServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
