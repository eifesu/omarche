import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateAgentMutation, useUpdateShipperMutation } from "@/redux/api/staff.api";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type EditStaffModalProps = {
    staff: any;
    type: 'agent' | 'shipper';
    onSuccess: () => void;
};

export function EditStaffModal({ staff, type, onSuccess }: EditStaffModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [firstName, setFirstName] = useState(staff.firstName);
    const [lastName, setLastName] = useState(staff.lastName);
    const [email, setEmail] = useState(staff.email);
    const [phone, setPhone] = useState(staff.phone);
    const [password, setPassword] = useState("");
    const { toast } = useToast();

    const [updateAgent] = useUpdateAgentMutation();
    const [updateShipper] = useUpdateShipperMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updateData: any = {
                firstName,
                lastName,
                email,
                phone,
            };
            if (password) {
                updateData.password = password;
            }
            if (type === 'agent') {
                await updateAgent({
                    agentId: staff.agentId,
                    ...updateData,
                }).unwrap();
            } else {
                await updateShipper({
                    shipperId: staff.shipperId,
                    ...updateData,
                }).unwrap();
            }
            setIsOpen(false);
            onSuccess();
            toast({
                title: "Staff Updated",
                description: `${type === 'agent' ? 'Agent' : 'Shipper'} has been successfully updated.`,
            });
        } catch (error) {
            console.error("Failed to update staff:", error);
            toast({
                title: "Error",
                description: "Failed to update staff. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Edit className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit {type === 'agent' ? 'Agent' : 'Shipper'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="firstName" className="text-right">
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lastName" className="text-right">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            New Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="col-span-3"
                            placeholder="Leave blank to keep current password"
                        />
                    </div>
                    <Button type="submit" className="ml-auto">
                        Save changes
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}