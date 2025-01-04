'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { ProductDetailsFormType, productDetailsSchema } from '@/schemas/products';
import {
  createProduct as createProductDb,
  deleteProduct as deleteProductDb,
} from '@/server/db/products';
import { auth } from '@clerk/nextjs/server';

interface CreateProductResponse {
  error: boolean;
  message: string;
}

const createProduct = async (
  unsafeData: ProductDetailsFormType,
): Promise<CreateProductResponse | undefined> => {
  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return { error: true, message: 'There was an error creating your product' };
  }

  const { id } = await createProductDb({ ...data, clerkUserId: userId });

  redirect(`/dashboard/products/${id}/edit?tab=countries`);
};

const deleteProduct = async (id: string) => {
  const { userId } = await auth();
  const errorMessage = 'There was an error deleting your product';

  if (userId == null) {
    return { error: true, message: errorMessage };
  }

  const isSuccess = await deleteProductDb({ id, userId });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/products');
  revalidatePath('/dashboard/products/edit');

  return {
    error: !isSuccess,
    message: isSuccess ? 'Successfully deleted your product' : errorMessage,
  };
};

export { createProduct, deleteProduct };
