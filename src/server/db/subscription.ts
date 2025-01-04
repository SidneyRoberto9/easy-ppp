import { SQL } from 'drizzle-orm';

import { subscriptionTiers } from '@/data/subscription-tiers';
import { db } from '@/drizzle/db';
import { UserSubscriptionTable } from '@/drizzle/schema';
import { CACHE_TAGS, dbCache, getUserTag, revalidateDbCache } from '@/lib/cache';

const createUserSubscription = async (data: typeof UserSubscriptionTable.$inferInsert) => {
  const [newSubscription] = await db
    .insert(UserSubscriptionTable)
    .values(data)
    .onConflictDoNothing({
      target: UserSubscriptionTable.clerkUserId,
    })
    .returning({
      id: UserSubscriptionTable.id,
      userId: UserSubscriptionTable.clerkUserId,
    });

  if (newSubscription != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      id: newSubscription.id,
      userId: newSubscription.userId,
    });
  }

  return newSubscription;
};

const getUserSubscription = (userId: string) => {
  const cacheFn = dbCache(getUserSubscriptionInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.subscription)],
  });

  return cacheFn(userId);
};

const updateUserSubscription = async (
  where: SQL,
  data: Partial<typeof UserSubscriptionTable.$inferInsert>,
) => {
  const [updatedSubscription] = await db
    .update(UserSubscriptionTable)
    .set(data)
    .where(where)
    .returning({
      id: UserSubscriptionTable.id,
      userId: UserSubscriptionTable.clerkUserId,
    });

  if (updatedSubscription != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      userId: updatedSubscription.userId,
      id: updatedSubscription.id,
    });
  }
};

const getUserSubscriptionTier = async (userId: string) => {
  const subscription = await getUserSubscription(userId);

  if (subscription == null) {
    throw new Error('User has no subscription');
  }

  return subscriptionTiers[subscription.tier];
};

const getUserSubscriptionInternal = (userId: string) => {
  return db.query.UserSubscriptionTable.findFirst({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
  });
};

export { getUserSubscriptionTier, updateUserSubscription };
