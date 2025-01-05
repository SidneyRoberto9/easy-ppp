import Link from 'next/link';
import { Ellipsis } from 'lucide-react';

import { Product } from '@/schemas/products';
import {
    DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu
} from '@/components/ui/dropdown-menu';
import { DialogTrigger, Dialog } from '@/components/ui/dialog';
import { CardTitle, CardHeader, CardDescription, CardContent, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialogTrigger, AlertDialog } from '@/components/ui/alert-dialog';
import DeleteProductAlertModalContent from '@/app/dashboard/_components/modals/delete-product-alert-modal-content';
import AddToSiteProductModalContent from '@/app/dashboard/_components/modals/add-to-site-product-modal-content';

const ProductCard = ({ id, name, url, description }: Product) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-between items-end">
          <CardTitle>
            <Link href={`/dashboard/products/${id}/edit`}>{name}</Link>
          </CardTitle>

          <Dialog>
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="size-8 p-0">
                    <div className="sr-only">Action Menu</div>
                    <Ellipsis className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/products/${id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  <DialogTrigger asChild>
                    <DropdownMenuItem>Add to Site</DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DeleteProductAlertModalContent id={id} />
            </AlertDialog>
            <AddToSiteProductModalContent id={id} />
          </Dialog>
        </div>
        <CardDescription>{url}</CardDescription>
      </CardHeader>
      {description && <CardContent>{description}</CardContent>}
    </Card>
  );
};

export default ProductCard;
