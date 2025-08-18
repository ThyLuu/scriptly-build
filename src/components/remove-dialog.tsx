'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { Id } from "../../convex/_generated/dataModel"
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from 'sonner'
import { useRouter } from "next/navigation";

interface RemoveDialogProps {
    documentId: Id<'documents'>;
    children: React.ReactNode;
}

export const RemoveDialog = ({ documentId, children }: RemoveDialogProps) => {
    const router = useRouter()

    const remove = useMutation(api.documents.removeById)
    const [isRemoving, setIsRemoving] = useState(false)

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn không ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Hành động này sẽ không thể hoàn tác. Thao tác này sẽ xóa vĩnh viễn tài liệu của bạn.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                        Hủy
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={isRemoving}
                        onClick={(e) => {
                            e.stopPropagation()
                            router.push('/')
                            setIsRemoving(true)
                            remove({ id: documentId })
                                .catch(() => toast.error('Đã xảy ra sự cố'))
                                .then(() => toast.success('Tài liệu đã được xóa'))
                                .finally(() => setIsRemoving(false))
                        }}
                        className="bg-blue-500 hover:bg-blue-700"
                    >
                        Xóa
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}