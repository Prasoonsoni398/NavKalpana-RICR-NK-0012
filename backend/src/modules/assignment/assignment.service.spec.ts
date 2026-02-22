import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from '../../common/entities/assignment.entity';


@Injectable()
export class AssignmentService {

  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,

    @InjectRepository(Submission)
    private submissionRepo: Repository<Submission>,
  ) {}

  async create(dto) {
    const assignment = this.assignmentRepo.create(dto);
    return this.assignmentRepo.save(assignment);
  }

  async submit(assignmentId: number, userId: number, dto) {
    const assignment = await this.assignmentRepo.findOne({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    const now = new Date();
    const isLate = now > assignment.deadline;

    const submission = this.submissionRepo.create({
      assignmentId,
      userId,
      ...dto,
      isLate,
      status: isLate ? 'LATE_SUBMITTED' : 'SUBMITTED',
    });

    return this.submissionRepo.save(submission);
  }

  async evaluate(submissionId: number, dto) {
    const submission = await this.submissionRepo.findOne({ where: { id: submissionId } });
    if (!submission) throw new NotFoundException('Submission not found');

    submission.marks = dto.marks;
    submission.feedback = dto.feedback;
    submission.status = 'EVALUATED';

    return this.submissionRepo.save(submission);
  }
}