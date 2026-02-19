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
    subject: 'Your OTP for RENS Account',
    html: `
<table width="100%" cellpadding="0" cellspacing="0" style="
  background: linear-gradient(135deg, #E4F1FF, #AED2FF);
  padding: 40px 20px;
  font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
">
  <tr>
    <td align="center">

      <!-- Main Card -->
      <table width="600" cellpadding="0" cellspacing="0" style="
        background-color: #ffffff;
        padding: 40px;
        border-radius: 16px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.08);
      ">

        <!-- Logo -->
        <tr>
          <td align="center" style="padding-bottom: 20px;">
            <img src="https://yourdomain.com/assets/logo.png" alt="RENS Logo" width="120" style="display:block;" />
          </td>
        </tr>

        <!-- Header -->
        <tr>
          <td align="center">
            <h1 style="
              color: #27005D;
              font-size: 26px;
              font-weight: 700;
              margin: 0 0 10px 0;
            ">
              Your One-Time Password (OTP)
            </h1>
          </td>
        </tr>

        <tr>
          <td align="center" style="
            color: #4b5563;
            font-size: 15px;
            padding-bottom: 30px;
          ">
            Use the OTP below to verify your RENS account. It is valid for <strong>10 minutes</strong>.
          </td>
        </tr>

        <!-- OTP Box -->
        <tr>
          <td align="center" style="
            background: linear-gradient(135deg, #AED2FF, #E4F1FF);
            border-radius: 12px;
            padding: 22px;
            border: 2px dashed #9400FF;
          ">
            <div style="
              font-size: 36px;
              font-weight: 700;
              letter-spacing: 6px;
              color: #9400FF;
              margin: 12px 0 8px 0;
            ">
              ${otp}
            </div>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td align="center" style="
            padding: 28px 0;
            color: #27005D;
            font-size: 14px;
            font-weight: bold;
          ">
            — OR —
          </td>
        </tr>

        <!-- Optional Button (like confirm account) -->
        <tr>
          <td align="center">
            <a href="https://yourdomain.com/verify-otp?email=${to}&otp=${otp}" style="
              display: inline-block;
              padding: 18px 36px;
              background: linear-gradient(135deg, #9400FF, #27005D);
              color: #ffffff;
              text-decoration: none;
              border-radius: 50px;
              font-size: 16px;
              font-weight: 600;
              transition: all 0.3s ease;
            " onmouseover="this.style.background='linear-gradient(135deg, #27005D, #9400FF)'">
              🔑 Verify OTP
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="
            padding-top: 28px;
            font-size: 11px;
            color: #27005D;
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
  background: linear-gradient(135deg, #E4F1FF, #AED2FF);
  padding: 40px 20px;
  font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="
        background-color:#ffffff;
        padding:40px;
        border-radius:16px;
        box-shadow:0 12px 32px rgba(0,0,0,0.08);
      ">

        <!-- Header -->
        <tr>
          <td align="center">
            <h1 style="
              color:#27005D;
              font-size:26px;
              margin:0 0 10px 0;
              font-weight:700;
            ">
              Reset Your Password
            </h1>
          </td>
        </tr>

        <tr>
          <td align="center" style="
            color:#4b5563;
            font-size:15px;
            padding-bottom:30px;
          ">
            We received a request to reset your RENS account password.
          </td>
        </tr>

        <!-- OTP Box -->
        <tr>
          <td align="center" style="
            background: linear-gradient(135deg, #AED2FF, #E4F1FF);
            border-radius:12px;
            padding:22px;
            border:2px dashed #9400FF;
          ">
            <p style="margin:0 0 6px 0; font-size:14px; color:#27005D; font-weight:600;">
              Your One-Time Password (OTP)
            </p>

            <div style="
              font-size:36px;
              font-weight:700;
              letter-spacing:6px;
              color:#9400FF;
              margin:12px 0 8px 0;
            ">
              ${otp}
            </div>

            <p style="margin:0; font-size:13px; color:#27005D;">
              ⏱ Valid for <strong>10 minutes</strong>
            </p>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td align="center" style="
            padding:28px 0;
            color:#27005D;
            font-size:14px;
            font-weight:bold;
          ">
            — OR —
          </td>
        </tr>

        <!-- Reset Button -->
        <tr>
          <td align="center">
            <a href="${resetLink}" style="
              display:inline-block;
              padding:18px 36px;
              background: linear-gradient(135deg, #9400FF, #27005D);
              color:#ffffff;
              text-decoration:none;
              border-radius:50px;
              font-size:16px;
              font-weight:600;
              transition: all 0.3s ease;
            " onmouseover="this.style.background='linear-gradient(135deg, #27005D, #9400FF)'">
              🔒 Reset Password
            </a>

            <p style="
              margin-top:12px;
              font-size:13px;
              color:#27005D;
            ">
              Link expires in <strong>15 minutes</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="
            padding-top:28px;
            font-size:11px;
            color:#27005D;
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
