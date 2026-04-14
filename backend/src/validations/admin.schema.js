const { z } = require('zod');

const createProductSchema = z.object({
  body: z.object({
    handle: z.string().min(1, 'Handle là bắt buộc'),
    title: z.string().min(1, 'Title là bắt buộc'),
    description: z.string().optional(),
    descriptionHtml: z.string().optional(),
    availableForSale: z.boolean().optional(),
    // We coerce priceAmount because it might come as a string from FormData or JSON
    priceAmount: z.coerce.number().positive('Giá phải lớn hơn 0'),
    priceCurrency: z.string().optional(),
    collectionIds: z.array(z.string().min(1)).optional(), // chấp nhận UUID hoặc handle
  }),
});

const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID sản phẩm không hợp lệ'),
  }),
  body: createProductSchema.shape.body.partial(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
