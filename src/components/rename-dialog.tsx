'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Id } from "../../convex/_generated/dataModel"
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from 'sonner'

interface RenameDialogProps {
    documentId: Id<'documents'>;
    initialTitle: string;
    children: React.ReactNode;
}

export const RenameDialog = ({ documentId, initialTitle, children }: RenameDialogProps) => {
    const update = useMutation(api.documents.updateById)
    const [isUpdating, setIsUpdating] = useState(false)

    const [title, setTitle] = useState(initialTitle)
    const [open, setOpen] = useState(false)

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsUpdating(true)

        update({ id: documentId, title: title.trim() || 'Không có tiêu đề' })
            .catch(() => toast.error('Đã xảy ra sự cố'))
            .then(() => toast.success('Tài liệu đã được đổi tên'))
            .finally(() => {
                setIsUpdating(false)
                setOpen(false)
            })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent onClick={(e) => e.stopPropagation()}>
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Đổi tên tài liệu</DialogTitle>
                        <DialogDescription>
                            Hãy nhập tên mới cho tài liệu này.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="my-4">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Tên tài liệu"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            title="button"
                            variant={'ghost'}
                            disabled={isUpdating}
                            onClick={(e) => {
                                e.stopPropagation()
                                setOpen(false)
                            }}
                        >
                            Hủy
                        </Button>

                        <Button
                            type="submit"
                            disabled={isUpdating}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-blue-500 hover:bg-blue-700"
                        >
                            Lưu
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}