import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteAgentMutation, useDeleteShipperMutation } from "@/redux/api/staff.api";
import { Trash2 } from "lucide-react";

type DeleteStaffModalProps = {
    staff: any;
    type: 'agent' | 'shipper';
    onSuccess: () => void;
};

export function DeleteStaffModal({ staff, type, onSuccess }: DeleteStaffModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [deleteAgent] = useDeleteAgentMutation();
    const [deleteShipper] = useDeleteShipperMutation();

    const handleDelete = async () => {
        try {
            if (type === 'agent') {
                await deleteAgent(staff.agentId).unwrap();
            } else {
                await deleteShipper(staff.shipperId).unwrap();
            }
            setIsOpen(false);
            onSuccess();
        } catch (error) {
            console.error("Failed to delete staff:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete {type === 'agent' ? 'Agent' : 'Shipper'}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>Are you sure you want to delete this {type}?</p>
                    <p>Name: {staff.firstName} {staff.lastName}</p>
                    <p>Email: {staff.email}</p>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}