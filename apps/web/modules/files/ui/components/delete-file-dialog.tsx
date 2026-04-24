"use client"

import { useMutation } from "convex/react";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { Loader2Icon } from "lucide-react";
import { api } from "@workspace/backend/convex/_generated/api";
import type { PublicFile } from "@workspace/backend/convex/private/files";
import { Id } from "@workspace/backend/convex/_generated/dataModel";

interface DeleteFileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    file: PublicFile | null;
    onFileDeleted?: () => void;
}

export const DeleteFileDialog = ({
    open,
    onOpenChange,
    file,
    onFileDeleted
}: DeleteFileDialogProps) => {
    const deleteFile = useMutation(api.private.files.deleteFile);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!file) return;
        setIsDeleting(true);
        try {
            await deleteFile({ entryId: file.id as string });
            onFileDeleted?.();
            onOpenChange(false);
        } catch (err) {
            console.error(err);
            alert("Error deleting file");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        < Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={"sm:max-w-[425px]"}>
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-xl font-bold text-red-500">Delete File</DialogTitle>
                    <DialogDescription className="text-lg ">Are you sure you want to delete this file?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        disabled={isDeleting}
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete || !file}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2Icon className="animate-spin" /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 