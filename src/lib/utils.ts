import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const removeTrailingSlash = (path: string) => {
  return path.replace(/\/$/, '');
};

export { cn, removeTrailingSlash };
