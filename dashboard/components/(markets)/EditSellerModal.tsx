import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Seller, useUpdateSellerByIdMutation } from "@/redux/api/sellers.api"
import { Edit } from "lucide-react"

interface EditSellerModalProps {
    seller: Seller
}

export function EditSellerModal({ seller }: EditSellerModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [firstName, setFirstName] = useState(seller.firstName)
    const [lastName, setLastName] = useState(seller.lastName)
    const [tableNumber, setTableNumber] = useState(seller.tableNumber.toString())
    const [updateSeller] = useUpdateSellerByIdMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await updateSeller({
                sellerId: seller.sellerId,
                firstName,
                lastName,
                tableNumber: parseInt(tableNumber),
            }).unwrap()
            setIsOpen(false)
        } catch (error) {
            console.error("Failed to update seller:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Edit className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Seller</DialogTitle>
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
                        <Label htmlFor="tableNumber" className="text-right">
                            Table Number
                        </Label>
                        <Input
                            id="tableNumber"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <Button type="submit" className="ml-auto">
                        Save changes
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}