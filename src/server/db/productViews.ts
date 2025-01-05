import { and, count, eq, gte } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { ProductTable, ProductViewTable } from '@/drizzle/schema';
import { CACHE_TAGS, dbCache, getUserTag, revalidateDbCache } from '@/lib/cache';

interface CreateProductViewProps {
  userId: string;
  countryId?: string;
  productId: string;
}

const getProductViewCount = async (userId: string, startDate: Date) => {
  const cacheFn = dbCache(getProductViewCountInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.productViews)],
  });

  return cacheFn(userId, startDate);
};

const createProductView = async ({ userId, countryId, productId }: CreateProductViewProps) => {
  const [newRow] = await db
    .insert(ProductViewTable)
    .values({ productId, countryId, visitedAt: new Date() })
    .returning({
      id: ProductViewTable.id,
    });

  if (newRow != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.productViews,
      userId,
      id: productId,
    });
  }
};

const getProductViewCountInternal = async (userId: string, startDate: Date) => {
  const counts = await db
    .select({ pricingViewCount: count() })
    .from(ProductViewTable)
    .innerJoin(ProductTable, eq(ProductTable.id, ProductViewTable.productId))
    .where(and(eq(ProductTable.clerkUserId, userId), gte(ProductViewTable.visitedAt, startDate)));

  return counts[0]?.pricingViewCount ?? 0;
};

export { createProductView, getProductViewCount };
