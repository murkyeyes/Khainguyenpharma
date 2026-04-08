const { z } = require('zod');

const addToCartSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Cart ID không hợp lệ'),
  }),
  body: z.object({
    merchandiseId: z.string().min(1, 'Merchandise ID là bắt buộc'),
    quantity: z.number().int().min(1).optional(),
  }),
});

const updateCartSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Cart ID không hợp lệ'),
  }),
  body: z.object({
    lines: z.array(z.object({
      id: z.string().min(1),
      quantity: z.number().int().min(0),
    })),
  }),
});

module.exports = {
  addToCartSchema,
  updateCartSchema,
};
