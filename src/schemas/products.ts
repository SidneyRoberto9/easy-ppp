import { z } from 'zod';

import { removeTrailingSlash } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  url: string;
  description?: string | null;
}

const productDetailsSchema = z.object({
  name: z.string().min(1, 'required'),
  url: z.string().url().min(1, 'required').transform(removeTrailingSlash),
  description: z.string().optional(),
});

const productCountryDiscountsSchema = z.object({
  groups: z.array(
    z
      .object({
        countryGroupId: z.string().min(1, 'Required'),
        discountPercentage: z
          .number()
          .max(100)
          .min(1)
          .or(z.nan())
          .transform((n) => (isNaN(n) ? undefined : n))
          .optional(),
        coupon: z.string().optional(),
      })
      .refine(
        (value) => {
          const hasCoupon = value.coupon != null && value.coupon.length > 0;
          const hasDiscount = value.discountPercentage != null;
          return !(hasCoupon && hasDiscount);
        },
        {
          message: 'A discount is required if a coupon code is provided',
          path: ['root'],
        },
      ),
  ),
});

const productCustomizationSchema = z.object({
  classPrefix: z.string().optional(),
  backgroundColor: z.string().min(1, 'Required'),
  textColor: z.string().min(1, 'Required'),
  fontSize: z.string().min(1, 'Required'),
  locationMessage: z.string().min(1, 'Required'),
  bannerContainer: z.string().min(1, 'Required'),
  isSticky: z.boolean(),
});

type ProductDetailsFormType = z.infer<typeof productDetailsSchema>;
type ProductCountryDiscountsFormType = z.infer<typeof productCountryDiscountsSchema>;
type ProductCustomizationSchemaFormType = z.infer<typeof productCustomizationSchema>;

export { productCountryDiscountsSchema, productCustomizationSchema, productDetailsSchema };
export type {
  Product,
  ProductCountryDiscountsFormType,
  ProductCustomizationSchemaFormType,
  ProductDetailsFormType,
};
