
const { Resend } = require('resend');
const path = require('path');
const fs = require('fs');

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to build the HTML content for the verification email
const buildVerificationEmailHtml = (username, verificationLink) => {
  const logoUrl = 'https://res.cloudinary.com/dssivkccb/image/upload/v1713330347/logo-letter-2_qrc8my.png';
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px solid #dddddd;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #00A551;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .header img {
          max-width: 150px;
        }
        .content {
          padding: 30px;
          line-height: 1.6;
        }
        .content h1 {
          color: #00A551;
        }
        .button {
          display: inline-block;
          background-color: #00A551;
          color: #ffffff;
          padding: 12px 25px;
          margin: 20px 0;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
        }
        .footer {
          background-color: #f0f0f0;
          padding: 20px;
          text-align: center;
          font-size: 0.9em;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="Khai Nguyen Pharma Logo">
        </div>
        <div class="content">
          <h1>Xác thực địa chỉ Email của bạn</h1>
          <p>Xin chào ${username},</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại Khai Nguyen Pharma. Vui lòng nhấn vào nút bên dưới để xác thực địa chỉ email và kích hoạt tài khoản của bạn:</p>
          <a href="${verificationLink}" class="button">Xác thực Email</a>
          <p>Đường dẫn xác thực sẽ hết hạn trong vòng 24 giờ. Nếu bạn không yêu cầu đăng ký này, vui lòng bỏ qua email này.</p>
          <p>Trân trọng,<br>Đội ngũ Khai Nguyen Pharma</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Khai Nguyen Pharma. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};


const sendVerificationEmail = async (to, username, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
  const htmlContent = buildVerificationEmailHtml(username, verificationLink);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Khai Nguyen Pharma <noreply@khainguyenpharma.com>',
      to: [to],
      subject: 'Xác thực tài khoản Khai Nguyen Pharma',
      html: htmlContent,
    });

    if (error) {
      console.error('Error sending email with Resend:', error);
      return { success: false, error };
    }

    console.log('Verification email sent successfully:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, error };
  }
};

module.exports = { sendVerificationEmail };

