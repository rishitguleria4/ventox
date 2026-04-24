"use client";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { useAction } from "convex/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
    CloudUploadIcon,
    FileUpIcon,
    Loader2Icon,
} from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
    Dropzone,
    DropzoneContent,
    DropzoneEmptyState,
} from "@workspace/ui/components/dropzone";
import { api } from "@workspace/backend/convex/_generated/api";

interface UploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFileUploaded?: () => void;

}

export const UploadDialog = ({
    open,
    onOpenChange,
    onFileUploaded
}: UploadDialogProps) => {
    const addfile = useAction(api.private.files.addFile);

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        category: "",
        filename: "",
    });

    const handlerFileDrop = (accepteFiles: File[]) => {
        const file = accepteFiles[0];

        if (file) {
            setUploadedFiles([file]);
            if (!uploadForm.filename) {
                setUploadForm((prev) => ({ ...prev, filename: file.name }));
            }
        }
    };

    const handleUpload = async () => {
        setIsUploading(true);
        try {
            const blob = uploadedFiles[0];

            if (!blob) {
                return;
            }

            const filename = uploadForm.filename || blob.name;

            await addfile({
                bytes: await blob.arrayBuffer(),
                filename,
                mimetype: blob.type || "text/plain",
                category: uploadForm.category,
            });
            onOpenChange(false);
            onFileUploaded?.();
        } catch (err) {
            console.error(err);
            alert("Error uploading file");
        } finally {
            setIsUploading(false);
            setUploadedFiles([]);
            setUploadForm({
                category: "",
                filename: "",
            });
        }
    }

    const handleCancel = () => {
        onOpenChange(false);
        setUploadedFiles([]);
        setUploadForm({
            category: "",
            filename: "",
        });
    }

    return (
        < Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>Upload a file to be processed.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 p-2">
                    <div className="space-y-2">
                        <Label htmlFor="category">
                            Category
                        </Label>
                        <Input
                            id="category"
                            placeholder="Select a category"
                            value={uploadForm.category}
                            onChange={(e) => setUploadForm((prev) => ({ ...prev, category: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="filename">
                            Filename{" "}
                            <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Input
                            id="filename"
                            placeholder="Update Filename"
                            value={uploadForm.filename}
                            onChange={(e) => setUploadForm((prev) => ({ ...prev, category: e.target.value }))}
                        />
                    </div>
                    <Dropzone
                        accept={{
                            "application/pdf": [".pdf"],
                            "application/msword": [".doc"],
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                            "text/csv": [".csv"],
                            "text/txt": [".txt"],
                        }}
                        disabled={isUploading}
                        maxFiles={1}
                        onDrop={handlerFileDrop}
                        src={uploadedFiles}
                    >
                        <DropzoneContent />
                        <DropzoneEmptyState />
                    </Dropzone>
                </div>
                <DialogFooter>
                    <Button
                        disabled={isUploading}
                        onClick={() => {handleCancel}}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isUploading}
                        onClick={async () => {handleUpload()}}
                    >
                        {isUploading ? "Uploading.." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}