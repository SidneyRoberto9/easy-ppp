import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const removeTrailingSlash = (path: string) => {
  return path.replace(/\/$/, '');
};

const createURL = (
  href: string,
  oldParams: Record<string, string>,
  newParams: Record<string, string | undefined>,
) => {
  const params = new URLSearchParams(oldParams);
  Object.entries(newParams).forEach(([key, value]) => {
    if (value == undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });
  return `${href}?${params.toString()}`;
};

export { cn, createURL, removeTrailingSlash };
