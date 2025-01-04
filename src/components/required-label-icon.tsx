import { AsteriskIcon } from 'lucide-react';
import { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

const RequiredLabelIcon = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AsteriskIcon>) => {
  return (
    <AsteriskIcon
      {...props}
      className={cn('text-destructive inline size-3 align-top', className)}
    />
  );
};

export default RequiredLabelIcon;
