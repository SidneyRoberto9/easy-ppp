import { revalidateTag, unstable_cache } from 'next/cache';
import { cache } from 'react';

const CACHE_TAGS = {
  products: 'products',
  productViews: 'productViews',
  subscription: 'subscription',
} as const;

interface DBCacheParams {
  tags: ValidTags[];
}

interface DBRevalidateCacheParams {
  tag: TagCache;
  userId?: string;
  id?: string;
}

type TagCache = keyof typeof CACHE_TAGS;
type ValidTags =
  | ReturnType<typeof getGlobalTag>
  | ReturnType<typeof getUserTag>
  | ReturnType<typeof getIdTag>;

const getGlobalTag = (tag: TagCache) => {
  return `global:${CACHE_TAGS[tag]}` as const;
};

const getUserTag = (userId: string, tag: TagCache) => {
  return `user:${userId}-${CACHE_TAGS[tag]}` as const;
};

const getIdTag = (id: string, tag: TagCache) => {
  return `user:${id}-${CACHE_TAGS[tag]}` as const;
};

const clearFullCache = () => {
  revalidateTag('*');
};

function dbCache<T extends (...args: any[]) => Promise<any>>(
  cb: Parameters<typeof unstable_cache<T>>[0],
  { tags }: DBCacheParams,
) {
  return cache(unstable_cache<T>(cb, undefined, { tags: tags }));
}

const revalidateDbCache = ({ tag, id, userId }: DBRevalidateCacheParams) => {
  revalidateTag(getGlobalTag(tag));

  if (userId != null) {
    revalidateTag(getUserTag(userId, tag));
  }

  if (id != null) {
    revalidateTag(getIdTag(id, tag));
  }
};

export {
  CACHE_TAGS,
  clearFullCache,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
  revalidateDbCache,
};
export type { TagCache, ValidTags };
