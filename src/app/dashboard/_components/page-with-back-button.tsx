import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

import { Button } from '@/components/ui/button';

interface PageWithBackButtonProps extends PropsWithChildren {
  backButtonHref: string;
  title: string;
}

const PageWithBackButton = ({ backButtonHref, title, children }: PageWithBackButtonProps) => {
  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-8">
      <Button className="rounded-full" variant="outline" size="icon" asChild>
        <Link href={backButtonHref}>
          <div className="sr-only">Back</div>
          <ChevronLeft className="size-8 -ml-0.5" />
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold self-center">{title}</h1>
      <div className="col-start-2">{children}</div>
    </div>
  );
};

export default PageWithBackButton;
