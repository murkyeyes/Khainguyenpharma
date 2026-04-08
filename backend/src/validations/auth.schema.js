const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    role: z.enum(['admin', 'customer']).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(1, 'Mật khẩu là bắt buộc'),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
