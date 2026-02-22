import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from '../../common/entities/assignment.entity';
import { AssignmentSubmission } from '../../common/entities/assignment-submission.entity';
import { SubmissionStatus } from '../../common/enums/submission-status.enum';  
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { SubmitAssignmentDto } from './dto/update-submit-assignment.dto';
import { EvaluateAssignmentDto } from './dto/evaluate-assignment.dto';
import { User } from 'src/common/entities/user.entity';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,

    @InjectRepository(AssignmentSubmission)
    private readonly submissionRepository: Repository<AssignmentSubmission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ Create Assignment
  async create(dto: CreateAssignmentDto): Promise<Assignment> {
    const assignment = this.assignmentRepository.create(dto);
    return await this.assignmentRepository.save(assignment);
  }

  // ✅ Get All
  async findAll(): Promise<Assignment[]> {
    return await this.assignmentRepository.find();
  }

  // ✅ Get One
  async findOne(id: number): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async findAssignmentWithSubmission(
  assignmentId: number,
  studentId: number,
): Promise<any> {

  
  const user = await this.userRepository.findOne({
    where: { id: studentId },
  });

  if (!user || user.role !== 'STUDENT') {
    throw new BadRequestException('User is not a student');
  }

  
  const assignment = await this.assignmentRepository.findOne({
    where: { id: assignmentId },
  });

  if (!assignment) {
    throw new NotFoundException(
      `Assignment with ID ${assignmentId} not found`,
    );
  }


  const submission = await this.submissionRepository.findOne({
    where: {
      assignmentId,
      studentId,
    },
  });

  return {
    assignment,
    submission: submission || null,
    isSubmitted: !!submission,
  };
}

  // ✅ Delete
  async remove(id: number): Promise<{ deleted: boolean }> {
    const assignment = await this.findOne(id);
    await this.assignmentRepository.remove(assignment);
    return { deleted: true };
  }

  // ✅ Submit Assignment
  async submit(
    assignmentId: number,
    studentId: number,
    dto: SubmitAssignmentDto,
  ): Promise<AssignmentSubmission> {

    const assignment = await this.findOne(assignmentId);

    // 🔥 Validation (Only one allowed)
    const filledFields = [
      dto.fileUrl,
      dto.textAnswer,
      dto.externalLink,
    ].filter(Boolean).length;

    if (filledFields === 0) {
      throw new BadRequestException(
        'At least one submission field must be provided',
      );
    }

  const existingSubmission = await this.submissionRepository.findOne({
      where: { assignmentId, studentId },
    });
    if (existingSubmission) {
      throw new BadRequestException(
        'You have already submitted this assignment',
      );
    }

    // if (filledFields > 1) {
    //   throw new BadRequestException(
    //     'Only one submission type is allowed',
    //   );
    // }

    const now = new Date();
    const isLate = now > assignment.deadline;

    const submission = this.submissionRepository.create({
      assignmentId,
      studentId,
      fileUrl: dto.fileUrl,
      textAnswer: dto.textAnswer,
      externalLink: dto.externalLink,
      lateFlag: isLate,
      status: isLate
        ? SubmissionStatus.LATE_SUBMITTED
        : SubmissionStatus.SUBMITTED,
    });

    return await this.submissionRepository.save(submission);
  }

  // ✅ Evaluate Submission
  async evaluate(
    submissionId: number,
    dto: EvaluateAssignmentDto,
  ): Promise<AssignmentSubmission> {

    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new NotFoundException(
        `Submission with ID ${submissionId} not found`,
      );
    }

    submission.marks = dto.marks;
    submission.feedback = dto.feedback;
    submission.status = SubmissionStatus.EVALUATED;

    return await this.submissionRepository.save(submission);
  }
}