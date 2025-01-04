import { getProductCount } from '@/server/db/products';
import { getUserSubscriptionTier } from '@/server/db/subscription';

const canRemoveBranding = async (userId: string | null) => {
  if (userId == null) {
    return false;
  }

  const tier = await getUserSubscriptionTier(userId);

  return tier.canRemoveBranding;
};

const canCustomizeBanner = async (userId: string | null) => {
  if (userId == null) {
    return false;
  }

  const tier = await getUserSubscriptionTier(userId);

  return tier.canCustomizeBanner;
};

const canAccessAnalytics = async (userId: string | null) => {
  if (userId == null) {
    return false;
  }

  const tier = await getUserSubscriptionTier(userId);

  return tier.canAccessAnalytics;
};
const canCreateProduct = async (userId: string | null) => {
  if (userId == null) {
    return false;
  }

  const tier = await getUserSubscriptionTier(userId);
  const productCount = await getProductCount(userId);

  return productCount < tier.maxNumberOfProducts;
};

export { canAccessAnalytics, canCreateProduct, canCustomizeBanner, canRemoveBranding };
