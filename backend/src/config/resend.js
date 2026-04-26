
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

const buildCancelEmailHtml = (username, orderId, reason) => {
  const logoUrl = 'https://res.cloudinary.com/dssivkccb/image/upload/v1713330347/logo-letter-2_qrc8my.png';
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thông báo hủy đơn hàng</title>
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
          background-color: #e53e3e;
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
          color: #e53e3e;
        }
        .reason-box {
          background-color: #fdf2f2;
          border-left: 4px solid #e53e3e;
          padding: 15px;
          margin: 20px 0;
          color: #c53030;
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
          <img src="\${logoUrl}" alt="Khai Nguyen Pharma Logo">
        </div>
        <div class="content">
          <h1>Thông báo hủy đơn hàng</h1>
          <p>Xin chào \${username},</p>
          <p>Khai Nguyên Pharma rất tiếc phải thông báo rằng đơn hàng <strong>#\${orderId.substring(0, 8)}</strong> của bạn đã bị hủy.</p>
          
          <div class="reason-box">
            <strong>Lý do hủy:</strong><br>
            \${reason || 'Do yêu cầu từ khách hàng hoặc không thể liên lạc'}
          </div>

          <p>Chúng tôi vô cùng xin lỗi về sự bất tiện này. Nếu bạn đã thanh toán trước, số tiền sẽ được hoàn lại theo quy định của phương thức thanh toán đã chọn (thường từ 2-5 ngày làm việc).</p>
          <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng phản hồi lại email này hoặc liên hệ hotline của chúng tôi.</p>
          
          <p>Trân trọng,<br>Đội ngũ Khai Nguyên Pharma</p>
        </div>
        <div class="footer">
          <p>&copy; \${new Date().getFullYear()} Khai Nguyen Pharma. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendOrderCancelEmail = async (to, username, orderId, reason) => {
  const htmlContent = buildCancelEmailHtml(username, orderId, reason);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Khai Nguyen Pharma <noreply@khainguyenpharma.com>',
      to: [to],
      subject: \`[Khai Nguyên Pharma] Thông báo hủy đơn hàng #\${orderId.substring(0, 8)}\`,
      html: htmlContent,
    });

    if (error) {
      console.error('Error sending cancel email with Resend:', error);
      return { success: false, error };
    }

    console.log('Cancel email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send cancel email:', error);
    return { success: false, error };
  }
};

module.exports = { sendVerificationEmail, sendOrderCancelEmail };

