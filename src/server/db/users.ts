import { eq } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { ProductTable, UserSubscriptionTable } from '@/drizzle/schema';
import { CACHE_TAGS, revalidateDbCache } from '@/lib/cache';

const deleteUser = async (clerkUserId: string) => {
  const [userSubscriptions, products] = await db.batch([
    db
      .delete(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId))
      .returning({
        id: UserSubscriptionTable.id,
      }),
    db.delete(ProductTable).where(eq(ProductTable.clerkUserId, clerkUserId)).returning({
      id: ProductTable.id,
    }),
  ]);

  userSubscriptions.forEach(({ id }) => {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      userId: clerkUserId,
      id,
    });
  });

  products.forEach(({ id }) => {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId: clerkUserId,
      id,
    });
  });

  return [userSubscriptions, products];
};

export { deleteUser };
