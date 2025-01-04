import { and, eq } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { ProductCustomizationTable, ProductTable } from '@/drizzle/schema';
import { CACHE_TAGS, dbCache, getUserTag, revalidateDbCache } from '@/lib/cache';

interface GetProductParams {
  limit?: number;
}

interface DeleteProductParams {
  id: string;
  userId: string;
}

const getProducts = async (userId: string, { limit = 10 }: GetProductParams) => {
  const cacheFn = dbCache(getProductsInternal, { tags: [getUserTag(userId, CACHE_TAGS.products)] });

  return cacheFn(userId, { limit });
};

const createProduct = async (data: typeof ProductTable.$inferInsert) => {
  const [newProduct] = await db.insert(ProductTable).values(data).returning({
    id: ProductTable.id,
    userId: ProductTable.clerkUserId,
  });

  try {
    await db
      .insert(ProductCustomizationTable)
      .values({ productId: newProduct.id })
      .onConflictDoNothing({
        target: ProductCustomizationTable.productId,
      });
  } catch (err) {
    await db.delete(ProductTable).where(eq(ProductTable.id, newProduct.id));
  }

  revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId: newProduct.userId,
    id: newProduct.id,
  });

  return newProduct;
};

const deleteProduct = async ({ id, userId }: DeleteProductParams) => {
  const { rowCount } = await db
    .delete(ProductTable)
    .where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)));

  if (rowCount > 0) {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId,
      id,
    });
  }

  return rowCount > 0;
};

const getProductsInternal = (userId: string, { limit = 10 }: GetProductParams) => {
  return db.query.ProductTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    limit,
  });
};

export { createProduct, deleteProduct, getProducts };