import { and, count, eq, inArray, sql } from 'drizzle-orm';
import { BatchItem } from 'drizzle-orm/batch';

import { db } from '@/drizzle/db';
import {
  CountryGroupDiscountTable,
  ProductCustomizationTable,
  ProductTable,
} from '@/drizzle/schema';
import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from '@/lib/cache';
import { removeTrailingSlash } from '@/lib/utils';

interface GetProductParams {
  limit?: number;
}

interface DeleteProductParams {
  id: string;
  userId: string;
}

interface GetProductProps extends DeleteProductParams {}

interface UpdateProductProps extends GetProductProps {}
interface GetProductCountryGroupsProps {
  productId: string;
  userId: string;
}

interface GetProductForBannerProps {
  id: string;
  countryCode: string;
  url: string;
}

const getProductCustomization = async ({ productId, userId }: GetProductCountryGroupsProps) => {
  const cacheFn = dbCache(getProductCustomizationInternal, {
    tags: [getIdTag(productId, CACHE_TAGS.products)],
  });

  return cacheFn({ productId, userId });
};

const getProductForBanner = async ({ id, countryCode, url }: GetProductForBannerProps) => {
  const cacheFn = dbCache(getProductForBannerInternal, {
    tags: [
      getIdTag(id, CACHE_TAGS.products),
      getGlobalTag(CACHE_TAGS.countries),
      getGlobalTag(CACHE_TAGS.countryGroups),
    ],
  });

  return cacheFn({ id, countryCode, url });
};

const getProductCountryGroups = async ({ productId, userId }: GetProductCountryGroupsProps) => {
  const cacheFn = dbCache(getProductCountryGroupsInternal, {
    tags: [
      getIdTag(productId, CACHE_TAGS.products),
      getGlobalTag(CACHE_TAGS.countries),
      getGlobalTag(CACHE_TAGS.countryGroups),
    ],
  });

  return cacheFn({ productId, userId });
};

const getProducts = async (userId: string, { limit = 10 }: GetProductParams = {}) => {
  const cacheFn = dbCache(getProductsInternal, { tags: [getUserTag(userId, CACHE_TAGS.products)] });

  return cacheFn(userId, { limit });
};

const getProduct = async ({ id, userId }: GetProductProps) => {
  const cacheFn = dbCache(getProductInternal, { tags: [getIdTag(id, CACHE_TAGS.products)] });

  return cacheFn({ id, userId });
};

const getProductCount = async (userId: string) => {
  const cacheFn = dbCache(getProductCountInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.products)],
  });

  return cacheFn(userId);
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

const updateProduct = async (
  data: Partial<typeof ProductTable.$inferInsert>,
  { id, userId }: UpdateProductProps,
) => {
  const { rowCount } = await db
    .update(ProductTable)
    .set(data)
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

const getProductInternal = ({ id, userId }: GetProductProps) => {
  return db.query.ProductTable.findFirst({
    where: ({ clerkUserId, id: idCol }, { eq }) => and(eq(clerkUserId, userId), eq(idCol, id)),
  });
};

const getProductCountryGroupsInternal = async ({
  productId,
  userId,
}: GetProductCountryGroupsProps) => {
  const product = await getProduct({ id: productId, userId });

  if (product == null) {
    return [];
  }

  const data = await db.query.CountryGroupTable.findMany({
    with: {
      countries: {
        columns: {
          name: true,
          code: true,
        },
      },
      countryGroupDiscounts: {
        columns: {
          coupon: true,
          discountPercentage: true,
        },
        where: ({ productId: productIdCol }, { eq }) => eq(productIdCol, product.id),
        limit: 1,
      },
    },
  });

  return data.map((group) => ({
    id: group.id,
    name: group.name,
    recommendedDiscountPercentage: group.recommendedDiscountPercentage,
    countries: group.countries,
    discount: group.countryGroupDiscounts.at(0),
  }));
};

const updateCountryDiscounts = async (
  deleteGroup: { countryGroupId: string }[],
  insertGroup: (typeof CountryGroupDiscountTable.$inferInsert)[],
  { productId, userId }: { productId: string; userId: string },
) => {
  const product = await getProduct({ id: productId, userId });
  if (product == null) return false;

  const statements: BatchItem<'pg'>[] = [];
  if (deleteGroup.length > 0) {
    statements.push(
      db.delete(CountryGroupDiscountTable).where(
        and(
          eq(CountryGroupDiscountTable.productId, productId),
          inArray(
            CountryGroupDiscountTable.countryGroupId,
            deleteGroup.map((group) => group.countryGroupId),
          ),
        ),
      ),
    );
  }

  if (insertGroup.length > 0) {
    statements.push(
      db
        .insert(CountryGroupDiscountTable)
        .values(insertGroup)
        .onConflictDoUpdate({
          target: [CountryGroupDiscountTable.productId, CountryGroupDiscountTable.countryGroupId],
          set: {
            coupon: sql.raw(`excluded.${CountryGroupDiscountTable.coupon.name}`),
            discountPercentage: sql.raw(
              `excluded.${CountryGroupDiscountTable.discountPercentage.name}`,
            ),
          },
        }),
    );
  }

  if (statements.length > 0) {
    await db.batch(statements as [BatchItem<'pg'>]);
  }

  revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId,
    id: productId,
  });
};

const updateProductCustomization = async (
  data: Partial<typeof ProductCustomizationTable.$inferInsert>,
  { productId, userId }: GetProductCountryGroupsProps,
) => {
  const product = await getProduct({ id: productId, userId });
  if (product == null) return;

  await db
    .update(ProductCustomizationTable)
    .set(data)
    .where(eq(ProductCustomizationTable.productId, productId));

  revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId,
    id: productId,
  });
};

const getProductCustomizationInternal = async ({
  productId,
  userId,
}: GetProductCountryGroupsProps) => {
  const data = await db.query.ProductTable.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) => and(eq(id, productId), eq(clerkUserId, userId)),
    with: {
      productCustomization: true,
    },
  });

  return data?.productCustomization;
};

const getProductCountInternal = async (userId: string) => {
  const counts = await db
    .select({ productCount: count() })
    .from(ProductTable)
    .where(eq(ProductTable.clerkUserId, userId));

  return counts[0]?.productCount ?? 0;
};

const getProductForBannerInternal = async ({ id, countryCode, url }: GetProductForBannerProps) => {
  const data = await db.query.ProductTable.findFirst({
    where: ({ id: idCol, url: urlCol }, { eq, and }) =>
      and(eq(idCol, id), eq(urlCol, removeTrailingSlash(url))),
    columns: {
      id: true,
      clerkUserId: true,
    },
    with: {
      productCustomization: true,
      countryGroupDiscounts: {
        columns: {
          coupon: true,
          discountPercentage: true,
        },
        with: {
          countryGroup: {
            columns: {},
            with: {
              countries: {
                columns: {
                  id: true,
                  name: true,
                },
                limit: 1,
                where: ({ code }, { eq }) => eq(code, countryCode),
              },
            },
          },
        },
      },
    },
  });

  const discount = data?.countryGroupDiscounts.find(
    (discount) => discount.countryGroup.countries.length > 0,
  );

  const country = discount?.countryGroup.countries[0];

  const product =
    data == null || data.productCustomization == null
      ? undefined
      : {
          id: data.id,
          clerkUserId: data.clerkUserId,
          customization: data.productCustomization,
        };

  return {
    product,
    country,
    discount:
      discount == null
        ? undefined
        : {
            coupon: discount.coupon,
            percentage: discount.discountPercentage,
          },
  };
};

export {
  createProduct,
  deleteProduct,
  getProduct,
  getProductCount,
  getProductCountryGroups,
  getProductCustomization,
  getProductForBanner,
  getProducts,
  updateCountryDiscounts,
  updateProduct,
  updateProductCustomization,
};
