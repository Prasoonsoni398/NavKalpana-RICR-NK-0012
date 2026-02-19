import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailer: MailerService) {}

  async sendResetPassword(email: string, link: string) {
    await this.mailer.sendMail({
      to: email,
      subject: 'Reset Password',
      html: `
        <h3>Password Reset</h3>
        <a href="${link}">${link}</a>
        <p>Valid for 15 minutes</p>
      `,
    });
  }

  async sendOtpEmail(to: string, otp: string) {
  await this.mailer.sendMail({
    to,
    subject: 'Password Reset OTP',
    html: `
      <p>Your password reset OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });
}

async sendOtpAndResetLink(
  to: string,
  otp: string,
  resetLink: string
) {
  await this.mailer.sendMail({
    to,
    subject: 'Reset Your Password | RENS',
    html: `
     <table width="100%" cellpadding="0" cellspacing="0" style="
  background: linear-gradient(135deg, #eef2f7, #f9fbfd);
  padding: 30px;
  font-family: Segoe UI, Arial, Helvetica, sans-serif;
">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="
        background-color:#ffffff;
        padding:35px;
        border-radius:12px;
        box-shadow:0 8px 24px rgba(0,0,0,0.08);
      ">

        <!-- Logo -->
        <tr>
        </tr>

        <!-- Header -->
        <tr>
          <td align="center">
            <h1 style="
              color:#1f2937;
              font-size:24px;
              margin:0 0 10px 0;
            ">
              Password Reset Request
            </h1>
          </td>
        </tr>

        <tr>
          <td align="center" style="
            color:#4b5563;
            font-size:15px;
            padding-bottom:30px;
          ">
            You requested to reset your RENS account password.
          </td>
        </tr>

        <!-- OTP -->
        <tr>
          <td align="center" style="
            background-color:#f1f5ff;
            border:1px dashed #007bff;
            border-radius:10px;
            padding:18px;
          ">
            <p style="margin:0 0 8px 0; font-size:14px; color:#374151;">
              Your One-Time Password (OTP)
            </p>

            <div style="
              font-size:32px;
              font-weight:600;
              letter-spacing:6px;
              color:#007bff;
              margin:10px 0;
            ">
              ${otp}
            </div>

            <p style="margin:0; font-size:13px; color:#6b7280;">
              ⏱ Valid for <strong>10 minutes</strong>
            </p>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td align="center" style="
            padding:25px 0;
            color:#9ca3af;
            font-size:13px;
            font-weight:bold;
          ">
            — OR —
          </td>
        </tr>

        <!-- Button -->
        <tr>
          <td align="center">
            <a href="${resetLink}" style="
              display:inline-block;
              padding:16px 30px;
              background:#007bff;
              color:#ffffff;
              text-decoration:none;
              border-radius:50px;
              font-size:15px;
              font-weight:600;
            ">
              🔒 Reset Password
            </a>

            <p style="
              margin-top:12px;
              font-size:13px;
              color:#6b7280;
            ">
              Link expires in <strong>15 minutes</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="
            padding-top:25px;
            font-size:11px;
            color:#9ca3af;
          ">
            © ${new Date().getFullYear()} RENS. All rights reserved.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

    `,
  });
}



}
