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

type ProductDetailsFormType = z.infer<typeof productDetailsSchema>;

export { productDetailsSchema };
export type { Product, ProductDetailsFormType };
