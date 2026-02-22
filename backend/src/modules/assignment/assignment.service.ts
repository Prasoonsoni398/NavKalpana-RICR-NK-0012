import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from '../../common/entities/assignment.entity';
import { Submission } from '../../common/entities/submission.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
// import { UpdateAssignmentDto } from './dto/update-submit-assignment.dto';
import { SubmitAssignmentDto } from './dto/update-submit-assignment.dto';
import { EvaluateAssignmentDto } from './dto/evaluate-assignment.dto';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,

    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
  ) {}

  // ✅ Create Assignment
  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const assignment = this.assignmentRepository.create(createAssignmentDto);
    return await this.assignmentRepository.save(assignment);
  }

  // ✅ Get All Assignments
  async findAll(): Promise<Assignment[]> {
    return await this.assignmentRepository.find();
  }

  // ✅ Get Single Assignment
  async findOne(id: number): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException(
        `Assignment with ID ${id} not found`,
      );
    }

    return assignment;
  }

  // ✅ Update Assignment
  // async update(
  //   id: number,
  //   updateAssignmentDto: UpdateAssignmentDto,
  // ): Promise<Assignment> {
  //   const assignment = await this.findOne(id);
  //   Object.assign(assignment, updateAssignmentDto);
  //   return await this.assignmentRepository.save(assignment);
  // }

  // ✅ Delete Assignment
  async remove(id: number): Promise<{ deleted: boolean }> {
    const assignment = await this.findOne(id);
    await this.assignmentRepository.remove(assignment);
    return { deleted: true };
  }

  // ✅ Submit Assignment (Real-time + Late Detection)
  async submit(
    assignmentId: number,
    userId: number,
    submitDto: SubmitAssignmentDto,
  ): Promise<Submission> {
    const assignment = await this.findOne(assignmentId);

    // Ensure at least one submission type is provided
    if (
      !submitDto.fileUrl &&
      !submitDto.textAnswer &&
      !submitDto.externalLink
    ) {
      throw new BadRequestException(
        'At least one submission type must be provided',
      );
    }

    const now = new Date();
    const isLate = now > assignment.deadline;

    const submission = this.submissionRepository.create({
      assignmentId,
      userId,
      ...submitDto,
      isLate,
      status: isLate ? 'LATE_SUBMITTED' : 'SUBMITTED',
    });

    return await this.submissionRepository.save(submission);
  }

  // ✅ Evaluate Submission (Dummy Evaluation Allowed)
  async evaluate(
    submissionId: number,
    evaluateDto: EvaluateAssignmentDto,
  ): Promise<Submission> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new NotFoundException(
        `Submission with ID ${submissionId} not found`,
      );
    }

    submission.marks = evaluateDto.marks;
    submission.feedback = evaluateDto.feedback;
    submission.status = 'EVALUATED';

    return await this.submissionRepository.save(submission);
  }
}