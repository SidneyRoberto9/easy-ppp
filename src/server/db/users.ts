import { eq } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { ProductTable, UserSubscriptionTable } from '@/drizzle/schema';

const deleteUser = async (clerkUserId: string) => {
  await db.batch([
    db.delete(UserSubscriptionTable).where(eq(UserSubscriptionTable.clerkUserId, clerkUserId)),
    db.delete(ProductTable).where(eq(ProductTable.clerkUserId, clerkUserId)),
  ]);
};

export { deleteUser };
