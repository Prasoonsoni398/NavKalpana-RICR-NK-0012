import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doubt } from '../../common/entities/doubt.entity';
import { BackupClassRequest } from '../../common/entities/backup-class-request.entity';
import { Course } from '../../common/entities/course.entity';

import { CreateDoubtDto } from './dto/create-doubt.dto';
import { CreateBackupRequestDto } from './dto/create-backup-request.dto';

@Injectable()
export class LearningSupportService {
  constructor(
    @InjectRepository(Doubt)
    private readonly doubtRepository: Repository<Doubt>,

    @InjectRepository(BackupClassRequest)
    private readonly backupRepository: Repository<BackupClassRequest>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  // ========================================
  // 1️⃣ Submit Doubt
  // ========================================
  async submitDoubt(studentId: string, createDoubtDto: CreateDoubtDto) {
    const { courseId, topic, description, fileUrl } = createDoubtDto;

    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const doubt = this.doubtRepository.create({
      studentId,
      topic,
      question: description,
      screenshotUrl: fileUrl ?? null,
      course,
    });

    await this.doubtRepository.save(doubt);

    return {
      message: 'Doubt submitted successfully',
      doubt,
    };
  }

  // ========================================
  // 2️⃣ Request Backup Class
  // ========================================
  async requestBackupClass(
    studentId: string,
    createBackupDto: CreateBackupRequestDto,
  ) {
    const { courseId, topic, description } = createBackupDto;

    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const backupRequest = this.backupRepository.create({
      studentId,
      topic,
      description,
      course,
    });

    await this.backupRepository.save(backupRequest);

    return {
      message: 'Backup class request submitted successfully',
      backupRequest,
    };
  }

  // ========================================
  // 3️⃣ Get Student Doubts
  // ========================================
  async getStudentDoubts(studentId: string) {
    return this.doubtRepository.find({
      where: { studentId },
      relations: ['course'],
      order: { createdAt: 'DESC' },
    });
  }

  // ========================================
  // 4️⃣ Get Student Backup Requests
  // ========================================
  async getStudentBackupRequests(studentId: string) {
    return this.backupRepository.find({
      where: { studentId },
      relations: ['course'],
      order: { requestedAt: 'DESC' },
    });
  }
}
