import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { TierNames, subscriptionTiers } from '@/data/subscription-tiers';

const createdAt = timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
const updatedAt = timestamp('updated_at', { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

const ProductTable = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    name: text('name').notNull(),
    url: text('url').notNull(),
    description: text('description'),
    createdAt,
    updatedAt,
  },
  (table) => ({
    clerkUserIdIndex: index('products.clerk_user_id_index').on(table.clerkUserId),
  }),
);

const productRelations = relations(ProductTable, ({ one, many }) => ({
  productCustomization: one(ProductCustomizationTable),
  productViews: many(ProductViewTable),
  countryGroupDiscounts: many(CountryGroupDiscountTable),
}));

const ProductCustomizationTable = pgTable('product_customizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  classPrefix: text('class_prefix'),
  productId: uuid('product_id')
    .notNull()
    .references(() => ProductTable.id, { onDelete: 'cascade' })
    .unique(),
  locationMessage: text('location_message')
    .notNull()
    .default(
      'Hey! It looks like you are from <b>{country}</b>. We support Parity Purchasing Power, so if you need it, use code <b>“{coupon}”</b> to get <b>{discount}%</b> off.',
    ),
  backgroundColor: text('background_color').notNull().default('hsl(193, 82%, 31%)'),
  textColor: text('text_color').notNull().default('hsl(0, 0%, 100%)'),
  fontSize: text('font_size').notNull().default('1rem'),
  bannerContainer: text('banner_container').notNull().default('body'),
  isSticky: boolean('is_sticky').notNull().default(true),
  createdAt,
  updatedAt,
});

const productCustomizationRelations = relations(ProductCustomizationTable, ({ one }) => ({
  product: one(ProductTable, {
    fields: [ProductCustomizationTable.productId],
    references: [ProductTable.id],
  }),
}));

const ProductViewTable = pgTable('product_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .notNull()
    .references(() => ProductTable.id, { onDelete: 'cascade' }),
  countryId: uuid('country_id').references(() => CountryTable.id, {
    onDelete: 'cascade',
  }),
  visitedAt: timestamp('visited_at', { withTimezone: true }).notNull().defaultNow(),
});

const productViewRelations = relations(ProductViewTable, ({ one }) => ({
  product: one(ProductTable, {
    fields: [ProductViewTable.productId],
    references: [ProductTable.id],
  }),
  country: one(CountryTable, {
    fields: [ProductViewTable.countryId],
    references: [CountryTable.id],
  }),
}));

const CountryTable = pgTable('countries', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  code: text('code').notNull().unique(),
  countryGroupId: uuid('country_group_id')
    .notNull()
    .references(() => CountryGroupTable.id, { onDelete: 'cascade' }),
  createdAt,
  updatedAt,
});

const countryRelations = relations(CountryTable, ({ many, one }) => ({
  countryGroups: one(CountryGroupTable, {
    fields: [CountryTable.countryGroupId],
    references: [CountryGroupTable.id],
  }),
  productViews: many(ProductViewTable),
}));

const CountryGroupTable = pgTable('country_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  recommendedDiscountPercentage: real('recommended_discount_percentage'),
  createdAt,
  updatedAt,
});

const countryGroupRelations = relations(CountryGroupTable, ({ many }) => ({
  countries: many(CountryTable),
  countryGroupDiscounts: many(CountryGroupDiscountTable),
}));

const CountryGroupDiscountTable = pgTable(
  'country_group_discounts',
  {
    countryGroupId: uuid('country_group_id')
      .notNull()
      .references(() => CountryGroupTable.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => ProductTable.id, { onDelete: 'cascade' }),
    coupon: text('coupon').notNull(),
    discountPercentage: real('discount_percentage').notNull(),
    createdAt,
    updatedAt,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.countryGroupId, table.productId] }),
  }),
);

const countryGroupDiscountRelations = relations(CountryGroupDiscountTable, ({ one }) => ({
  product: one(ProductTable, {
    fields: [CountryGroupDiscountTable.productId],
    references: [ProductTable.id],
  }),
  countryGroup: one(CountryGroupTable, {
    fields: [CountryGroupDiscountTable.countryGroupId],
    references: [CountryGroupTable.id],
  }),
}));

const TierEnum = pgEnum('tier', Object.keys(subscriptionTiers) as [TierNames]);

const UserSubscriptionTable = pgTable(
  'user_subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull().unique(),
    stripeSubscriptionItemId: text('stripe_subscription_item_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeCustomerId: text('stripe_customer_id'),
    tier: TierEnum('tier').notNull(),
    createdAt,
    updatedAt,
  },
  (table) => ({
    clerkUserIdIndex: index('user_subscriptions.clerk_user_id_index').on(table.clerkUserId),
    stripeCustomerIdIndex: index('user_subscriptions.stripe_customer_id_index').on(
      table.stripeCustomerId,
    ),
  }),
);

export {
  CountryGroupDiscountTable,
  CountryGroupTable,
  CountryTable,
  ProductCustomizationTable,
  ProductTable,
  ProductViewTable,
  TierEnum,
  UserSubscriptionTable,
  countryGroupDiscountRelations,
  countryGroupRelations,
  countryRelations,
  productCustomizationRelations,
  productRelations,
  productViewRelations,
};
