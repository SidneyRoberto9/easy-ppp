'use client';
import { useTransition } from 'react';

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteProduct } from '@/server/actions/products';

interface DeleteProductAlertModalContentProps {
  id: string;
}

const DeleteProductAlertModalContent = ({ id }: DeleteProductAlertModalContentProps) => {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const data = await deleteProduct(id);

      if (data.message) {
        toast({
          title: data.error ? 'Error' : 'Success',
          description: data.message,
          variant: data.error ? 'destructive' : 'default',
        });
      }
    });
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Area you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete this product.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete} disabled={isDeletePending}>
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteProductAlertModalContent;
