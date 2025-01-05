import Link from 'next/link';

import { createURL } from '@/lib/utils';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface TimezoneDropdownMenuItemProps {
  searchParams: Record<string, string>;
}

const TimezoneDropdownMenuItem = ({ searchParams }: TimezoneDropdownMenuItemProps) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <DropdownMenuItem asChild>
      <Link
        href={createURL('/dashboard/analytics', searchParams, {
          timezone: userTimezone,
        })}
      >
        {userTimezone}
      </Link>
    </DropdownMenuItem>
  );
};

export default TimezoneDropdownMenuItem;
