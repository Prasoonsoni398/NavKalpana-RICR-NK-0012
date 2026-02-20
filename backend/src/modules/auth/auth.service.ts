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
import { AuthProvider } from '../../common/entities/auth_providers.entity';

import { StudentSignupDto } from './dto/student-signup.dto';
import { TeacherSignupDto } from './dto/teacher-signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { LoginWithOtpDto } from './dto/login-with-otp.dto';
import { OtpPurpose } from 'src/common/enums/otp-purpose.enum';
import { MailService } from '../../common/config/mail/mail.service';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,

    @InjectRepository(AuthProvider)
    private readonly authProviderRepository: Repository<AuthProvider>,

    private readonly mailService: MailService,
  ) {}

  /* =========================================================
     ✅ SIGNUP
  ========================================================= */

  async signupStudent(dto: StudentSignupDto) {
    return this.signup(dto, 'STUDENT');
  }

  async signupTeacher(dto: TeacherSignupDto) {
    return this.signup(dto, 'TEACHER');
  }

  private async signup(dto: any, role: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email, role },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.save({
      name: dto.name,
      email: dto.email,
      role,
      isActive: false,
      isVerified: false,
    });

    // Store password in provider table (GOOD ARCHITECTURE ✅)
    await this.authProviderRepository.save({
      user,
      provider: 'LOCAL',
      passwordHash: hashedPassword,
    });

    return this.sendOtp(user, OtpPurpose.EMAIL_VERIFICATION);
  }

  /* =========================================================
     ✅ VERIFY EMAIL OTP
  ========================================================= */

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('User not found');

    const otp = await this.otpRepository.findOne({
      where: {
        user: { id: user.id },
        code: dto.code,
        type: OtpPurpose.EMAIL_VERIFICATION,
        isUsed: false,
      },
    });

    if (!otp || otp.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    otp.isUsed = true;
    await this.otpRepository.save(otp);

    user.isActive = true;
    user.isVerified = true;

    await this.userRepository.save(user);

    return { message: 'Account verified successfully' };
  }

  /* =========================================================
     ✅ LOGIN WITH PASSWORD
  ========================================================= */

  async loginWithPassword(dto: LoginDto, role: string) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email, role },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const provider = await this.authProviderRepository.findOne({
      where: {
        user: { id: user.id },
        provider: 'LOCAL',
      },
    });

    if (!provider?.passwordHash) {
      throw new UnauthorizedException('Password login not available');
    }

    const isMatch = await bcrypt.compare(
      dto.password,
      provider.passwordHash,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = generateToken(user);

    return {
      message: 'Login successful',
      accessToken: token,
      user,
    };
  }

  /* =========================================================
     ✅ REQUEST LOGIN OTP
  ========================================================= */

  async requestLoginOtp(dto: RequestOtpDto, role: string) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email, role },
    });

    if (!user) throw new NotFoundException('User not found');

    if (!user.isActive) {
      throw new UnauthorizedException('Account not verified');
    }

    return this.sendOtp(user, OtpPurpose.LOGIN);
  }

  /* =========================================================
     ✅ LOGIN WITH OTP
  ========================================================= */

  async loginWithOtp(dto: LoginWithOtpDto, role: string) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email, role },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid OTP');
    }

    const otp = await this.otpRepository.findOne({
      where: {
        user: { id: user.id },
        code: dto.code,
        type: OtpPurpose.LOGIN,
        isUsed: false,
      },
    });

    if (!otp || otp.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    otp.isUsed = true;
    await this.otpRepository.save(otp);

    const token = generateToken(user);

    return {
      message: 'Login successful',
      accessToken: token,
      user,
    };
  }

  /* =========================================================
     ✅ RESEND EMAIL OTP
  ========================================================= */

  async resendOtp(email: string, role: string) {
    const user = await this.userRepository.findOne({
      where: { email, role },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.isActive) {
      throw new BadRequestException('Account already verified');
    }

    return this.sendOtp(user, OtpPurpose.EMAIL_VERIFICATION);
  }

  /* =========================================================
     ✅ OTP CORE LOGIC
  ========================================================= */

  private async sendOtp(user: User, purpose: OtpPurpose) {
    const code = this.generateOtp();

    await this.otpRepository.update(
      {
        user: { id: user.id },
        type: purpose,
        isUsed: false,
      },
      { isUsed: true },
    );

    await this.otpRepository.save({
      user,
      code,
      type: purpose,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await this.mailService.sendOtpEmail(
      user.email,
      code,
      purpose,
    );

    return {
      message: `OTP sent for ${purpose.toLowerCase()}`,
    };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}