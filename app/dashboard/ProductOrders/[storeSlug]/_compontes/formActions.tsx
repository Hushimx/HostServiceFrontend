'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { AlertModal } from '@/components/modal/alert-modal';
import EditAdmin from '../../../test/edit'; // Import your editing component

// Interfaces
interface CellActionProps {
  data: any; // Define the data structure you're passing
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to track edit mode
  const router = useRouter();

  // Delete confirmation
  const onConfirm = async () => {
    setLoading(true);
    try {
      await fetch(`/api/products/${data.id}`, { method: 'DELETE' });
      router.refresh(); // Refresh the page or re-fetch the data
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  // Start editing
  const handleEdit = () => {
    setIsEditing(true); // Enable edit mode
  };

  // Save changes
  const handleSave = () => {
    setIsEditing(false);
    router.refresh(); // Refresh the table data after saving
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Component - Render inline or as modal */}
      {isEditing && (
        <div className="mt-4">
          <EditAdmin
            data={data}
            open={isEditing}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}
    </>
  );
};
