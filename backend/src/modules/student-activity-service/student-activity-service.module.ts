import { Module, Global } from '@nestjs/common';
import { StudentActivityServiceService } from './student-activity-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentActivityLog } from 'src/common/entities/student-activity-log.entity';
@Global() // 🔹 Make this module global
@Module({
  imports: [TypeOrmModule.forFeature([StudentActivityLog])],
  providers: [StudentActivityServiceService],
  exports: [StudentActivityServiceService], // 🔹 Export the service so it can be injected anywhere
})
export class StudentActivityServiceModule {}