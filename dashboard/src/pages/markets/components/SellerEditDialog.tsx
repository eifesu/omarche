import { useState } from "react"
import { Seller, useUpdateSellerMutation } from "@/redux/api/seller"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaEllipsisH, FaImage } from "react-icons/fa"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"

interface SellerEditDialogProps {
    seller: Seller
}

export default function SellerEditDialog({ seller }: SellerEditDialogProps) {
    const [updateSeller] = useUpdateSellerMutation()
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        firstName: seller.firstName,
        lastName: seller.lastName,
        tableNumber: seller.tableNumber,
        gender: seller.gender as "M" | "F",
        isActive: seller.isActive,
        pictureUrl: seller.pictureUrl ?? ""
    })
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        tableNumber?: string;
    }>({})

    const validateForm = () => {
        const newErrors: typeof errors = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = "Le prénom est requis"
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Le nom est requis"
        }

        if (isNaN(formData.tableNumber) || formData.tableNumber < 1) {
            newErrors.tableNumber = "Le numéro de table doit être supérieur à 0"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            await updateSeller({
                sellerId: seller.sellerId,
                updateData: formData
            }).unwrap()
            toast.success("Vendeur mis à jour avec succès")
            setIsOpen(false)
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du vendeur")
            console.error("Failed to update seller:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    Modifier
                    <FaEllipsisH className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifier le vendeur</DialogTitle>
                    <DialogDescription>
                        Modifier les informations du vendeur afin de les mettre à jour.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="firstName" className="text-right">
                            Prénom
                        </Label>
                        <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            className={`col-span-3 ${errors.firstName ? 'border-red-500' : ''}`}
                        />
                        {errors.firstName && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.firstName}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="lastName" className="text-right">
                            Nom
                        </Label>
                        <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            className={`col-span-3 ${errors.lastName ? 'border-red-500' : ''}`}
                        />
                        {errors.lastName && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.lastName}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="tableNumber" className="text-right">
                            Table №
                        </Label>
                        <Input
                            id="tableNumber"
                            type="number"
                            min={1}
                            value={formData.tableNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, tableNumber: parseInt(e.target.value) }))}
                            className={`col-span-3 ${errors.tableNumber ? 'border-red-500' : ''}`}
                        />
                        {errors.tableNumber && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.tableNumber}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="gender" className="text-right">
                            Genre
                        </Label>
                        <Select
                            value={formData.gender}
                            onValueChange={(value: "M" | "F") => setFormData(prev => ({ ...prev, gender: value }))}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Sélectionnez le genre" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="M">Homme</SelectItem>
                                <SelectItem value="F">Femme</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label>Photo</Label>
                        <ImageUpload
                            value={formData.pictureUrl}
                            onChange={(url) => setFormData({ ...formData, pictureUrl: url })}
                            onDelete={() => setFormData({ ...formData, pictureUrl: "" })}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) =>
                                setFormData(prev => ({ ...prev, isActive: checked as boolean }))
                            }
                        />
                        <Label htmlFor="isActive">Vendeur actif</Label>
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button type="button" variant="default" onClick={handleSubmit}>
                        Enregistrer
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Annuler
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 