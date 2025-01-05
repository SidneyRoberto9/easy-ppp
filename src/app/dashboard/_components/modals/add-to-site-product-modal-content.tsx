'use client';

import { CopyCheckIcon, CopyIcon, CopyXIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { env } from '@/data/env/client';

type CopyState = 'idle' | 'Copied!' | 'Error';

const getCopyIcon = (state: CopyState) => {
  switch (state) {
    case 'Copied!':
      return CopyCheckIcon;
    case 'Error':
      return CopyXIcon;
    default:
      return CopyIcon;
  }
};

const getChildren = (state: CopyState) => {
  switch (state) {
    case 'Copied!':
      return 'Copied!';
    case 'Error':
      return 'Error';
    default:
      return 'Copy Code';
  }
};

interface AddToSiteProductModalContentProps {
  id: string;
}

const AddToSiteProductModalContent = ({ id }: AddToSiteProductModalContentProps) => {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  const code = `<script src="${env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}/banner"></script>`;

  const Icon = getCopyIcon(copyState);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopyState('Copied!');
        setTimeout(() => setCopyState('idle'), 2000);
      })
      .catch(() => {
        setCopyState('Error');
        setTimeout(() => setCopyState('idle'), 2000);
      });
  };

  return (
    <DialogContent className="max-w-screen-md">
      <DialogHeader>
        <DialogTitle className="text-2xl">Start Earning PPP Sales!</DialogTitle>
        <DialogDescription>
          All you need to do is copy the below script into your site and your customers will start
          seeing PPP discounts
        </DialogDescription>
      </DialogHeader>
      <pre
        className="
      mb-4 overflow-x-auto p-4 bg-secondary rounded max-w-screen-xl text-secondary-foreground"
      >
        <code>{code}</code>
      </pre>
      <div className="flex gap-2">
        <Button onClick={handleCopy}>
          {<Icon className="size-4 mr-2" />}
          {getChildren(copyState)}
        </Button>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

export default AddToSiteProductModalContent;
