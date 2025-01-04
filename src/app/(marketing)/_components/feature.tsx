import { CheckIcon } from 'lucide-react';
import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

interface FeatureProps extends PropsWithChildren {
  className?: string;
}

const Feature = ({ children, className }: FeatureProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <CheckIcon className="size-4 stroke-accent bg-accent/25 rounded-full p-0.5" />
      <span>{children}</span>
    </div>
  );
};

export default Feature;
