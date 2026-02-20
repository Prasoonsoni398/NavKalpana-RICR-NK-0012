import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt.util';
import { User } from '../../common/entities/user.entity';
import { Otp } from '../../common/entities/otps.entity';
import { StudentSignupDto } from './dto/student-signup.dto';
import { TeacherSignupDto } from './dto/teacher-signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { MailService } from '../../common/config/mail/mail.service';
// import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
     private readonly mailService: MailService,
  ) {}

  //  STUDENT SIGNUP
  async signupStudent(dto:StudentSignupDto) {
    return this.signup(dto, 'STUDENT');
  }

  // TEACHER SIGNUP
  async signupTeacher(dto: TeacherSignupDto) {
    return this.signup(dto, 'TEACHER');
  }

  private async signup(dto: any, role: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.save({
      name: dto.name,
      email: dto.email,
      passwordHash: hashedPassword,
      role,
      isActive: false,
    });

    const code = this.generateOtp();

    await this.otpRepository.save({
      user,
      code,
      type: 'EMAIL_VERIFICATION',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    });

    // TODO: send email here
    console.log(`${role} OTP:`, code);
    const res = await this.mailService.sendOtpEmail(user.email,code)
    return { message: `OTP sent to ${role.toLowerCase()} email` };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('User not found');

    const otp = await this.otpRepository.findOne({
      where: {
        user: { id: user.id },
        code:'55555',
        isUsed: false,
      },
      relations: ['user'],
    });

    if (!otp || otp.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    otp.isUsed = true;
    await this.otpRepository.save(otp);

    user.isActive = true;
    await this.userRepository.save(user);

    return { message: 'Account verified successfully' };
  }

  // // 🟢 LOGIN (teacher/admin)
  // async login(dto: LoginDto, role: 'TEACHER' | 'ADMIN') {
  //   const user = await this.userRepository.findOne({
  //     where: { email: dto.email, role },
  //   });

  //   if (!user) throw new UnauthorizedException('Invalid credentials');

  //   if (!user.isActive) {
  //     throw new UnauthorizedException('Please verify your email first');
  //   }

  //   const isMatch = await bcrypt.compare(dto.password, user.passwordHash);

  //   if (!isMatch) throw new UnauthorizedException('Invalid credentials');

  //   const token = this.jwtService.sign({
  //     sub: user.id,
  //     email: user.email,
  //     role: user.role,
  //   });

  //   return {
  //     message: `${role} login successful`,
  //     accessToken: token,
  //   };
  // }

  // async loginTeacher(dto: LoginDto) {
  //   return this.login(dto, 'TEACHER');
  // }

  // async loginAdmin(dto: LoginDto) {
  //   return this.login(dto, 'ADMIN');
  // }

  // 🟢 RESEND OTP
  async resendOtp(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.isActive) throw new BadRequestException('Account already verified');

    const code = this.generateOtp();

    await this.otpRepository.save({
      user,
      code,
      type: 'EMAIL_VERIFICATION',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log('Resent OTP:', code);

    return { message: 'New OTP sent to email' };
  }

  // 🔹 Helper: generate 6-digit OTP
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
