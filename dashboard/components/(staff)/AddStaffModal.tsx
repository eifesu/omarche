import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAgentMutation, useCreateShipperMutation } from "@/redux/api/staff.api";
import { Plus } from "lucide-react";
import { useFetchMarketsQuery } from "@/redux/api/markets.api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

type AddStaffModalProps = {
    type: 'agent' | 'shipper';
    onSuccess: () => void;
};

export function AddStaffModal({ type, onSuccess }: AddStaffModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        selectedMarketId: "",
    });

    const [createAgent] = useCreateAgentMutation();
    const [createShipper] = useCreateShipperMutation();
    const { data: markets, isLoading: isMarketsLoading } = useFetchMarketsQuery();
    const { toast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { firstName, lastName, email, phone, password, selectedMarketId } = formData;
            const createFunction = type === 'agent' ? createAgent : createShipper;
            await createFunction({
                firstName,
                lastName,
                email,
                marketId: selectedMarketId,
                phone,
                password,
            }).unwrap();
            setIsOpen(false);
            onSuccess();
            toast({
                title: "Staff Added",
                description: `${type === 'agent' ? 'Agent' : 'Shipper'} has been successfully added.`,
            });
        } catch (error) {
            console.error("Failed to create staff:", error);
            toast({
                title: "Error",
                description: "Failed to add staff. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add {type === 'agent' ? 'Agent' : 'Shipper'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New {type === 'agent' ? 'Agent' : 'Shipper'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {['firstName', 'lastName', 'email', 'phone', 'password'].map((field) => (
                        <div key={field} className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={field} className="text-right">
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </Label>
                            <Input
                                id={field}
                                type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                                value={formData[field as keyof typeof formData]}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                    ))}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="market" className="text-right">
                            Market
                        </Label>
                        <Select
                            value={formData.selectedMarketId}
                            onValueChange={(marketId: string) => setFormData(prev => ({ ...prev, selectedMarketId: marketId }))}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Market" />
                            </SelectTrigger>
                            <SelectContent>
                                {isMarketsLoading ? (
                                    <SelectItem value="loading" disabled>Loading markets...</SelectItem>
                                ) : (
                                    markets?.map((market) => (
                                        <SelectItem key={market.marketId} value={market.marketId}>
                                            {market.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="ml-auto">
                        Create {type === 'agent' ? 'Agent' : 'Shipper'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}