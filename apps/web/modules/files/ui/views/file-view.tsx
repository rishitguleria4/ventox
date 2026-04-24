"use client";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
} from "@workspace/ui/components/dropdown-menu";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import type { PublicFile } from "@workspace/backend/convex/private/files";
import { Button } from "@workspace/ui/components/button";
import { FileIcon, Loader2Icon, MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { UploadDialog } from "../components/upload-dialog";
import { useState } from "react";
import { DeleteFileDialog } from "../components/delete-file-dialog";


export const FilesView = () => {
    const files = usePaginatedQuery(api.private.files.list, {},
        {
            initialNumItems: 10,
        }
    );

    const {
        topElementRef,
        handleLoadMore,
        canLoadMore,
        isLoadingFirstPage,
        isLoading,
    } = useInfiniteScroll({
        status: files.status,
        loadMore: files.loadMore,
        loadSize: 10,
    });

    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null);
    const handleDeleteClick = (file: PublicFile) => {
        setSelectedFile(file);
        setDeleteDialogOpen(true);
    }

    const handleFileDeleted = () => {
        setSelectedFile(null);
    }
    return (
        <>
            <DeleteFileDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                file={selectedFile}
                onFileDeleted={handleFileDeleted}
            />
            <UploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}/>
            <div className="flex min-h-screen flex-col bg-muted p-8">
                <div className="mx-auto w-full max-w-screen-md">
                    <div className="space-y-2">
                        <h1 className="text-xl font-bold md:text-2xl">
                            KNOWLEDGE BASE
                        </h1>
                        <p className="text-muted-foreground ">Upload and manage your PDF files. They will be used to train the AI assistant to answer questions more accurately.</p>
                    </div>
                    <div className="flex justify-end items-center mt-8 rounded-lg border bg-background px-6 py-4">
                        <Button
                            onClick={() => { setUploadDialogOpen(true) }}
                        >
                            <PlusIcon />
                            Add NEW
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-6 py-4 font-medium">Document Name</TableHead>
                                <TableHead className="px-6 py-4 font-medium">type</TableHead>
                                <TableHead className="px-6 py-4 font-medium">Size</TableHead>
                                <TableHead className="px-6 py-4 font-medium">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(() => {
                                if (isLoadingFirstPage) {
                                    return (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                                Loading... FIles..
                                            </TableCell>
                                        </TableRow>
                                    );
                                }

                                if (files.results.length === 0) {
                                    return (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                No Files Uploaded.
                                            </TableCell>
                                        </TableRow>
                                    );
                                }

                                return files.results.map((file) => (
                                    <TableRow className="hover:bg-muted/50" key={file.id}>
                                        <TableCell className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                <FileIcon className="mr-2 h-4 w-4" />
                                                {file.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                <Badge className="uppercase" >
                                                    {file.type}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                {file.size}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-medium">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontalIcon className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => {handleDeleteClick(file)}}>< TrashIcon className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>

                                ))
                            })()}
                        </TableBody>
                    </Table>
                    {!isLoadingFirstPage && files.results.length > 0 && (
                        <div className="border-t">
                            <InfiniteScrollTrigger
                                canLoadMore={canLoadMore}
                                isLoading={isLoading}
                                onLoadMore={handleLoadMore}
                                ref={topElementRef}
                            />
                        </div>
                    )}
                </div>

            </div>
        </>
    )
};