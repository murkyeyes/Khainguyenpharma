const fs = require('fs');

const filePath = 'D:/deploy_web/Khainguyenpharma/backend/src/config/resend.js';
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `const buildCancelEmailHtml = (username, orderId, reason) => {
  const logoUrl = 'https://res.cloudinary.com/dssivkccb/image/upload/v1713330347/logo-letter-2_qrc8my.png';
  return \`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thông báo hủy đơn hàng</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .header { background-color: #e53e3e; color: #ffffff; padding: 20px; text-align: center; }
        .header img { max-width: 150px; }
        .content { padding: 30px; line-height: 1.6; }
        .content h1 { color: #e53e3e; }
        .reason-box { background-color: #fdf2f2; border-left: 4px solid #e53e3e; padding: 15px; margin: 20px 0; color: #c53030; }
        .footer { background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; }
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
  \`;
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
\`;

// Replace from buildCancelEmailHtml to the end of the file
const startIdx = content.indexOf('const buildCancelEmailHtml');
if (startIdx !== -1) {
    content = content.substring(0, startIdx) + replacement;
    fs.writeFileSync(filePath, content, 'utf8');
} else {
    console.error('Could not find buildCancelEmailHtml in the file!');
}
`;

fs.writeFileSync('D:/deploy_web/Khainguyenpharma/backend/fix-resend.js', code, 'utf8');