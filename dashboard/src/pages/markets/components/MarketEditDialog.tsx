import { useState } from "react"
import { Market, useUpdateMarketMutation } from "@/redux/api/market"
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
import { FaEllipsisH } from "react-icons/fa"
import { Checkbox } from "@/components/ui/checkbox"
import { FaImage } from "react-icons/fa6"
import { ImageUpload } from "@/components/ui/image-upload"

interface MarketEditDialogProps {
    market: Market
}

export default function MarketEditDialog({ market }: MarketEditDialogProps) {
    const [updateMarket] = useUpdateMarketMutation()
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: market.name,
        latitude: market.latitude.toString(),
        longitude: market.longitude.toString(),
        isActive: market.isActive,
        pictureUrl: market.pictureUrl
    })
    const [errors, setErrors] = useState<{
        name?: string;
        latitude?: string;
        longitude?: string;
    }>({})

    const validateForm = () => {
        const newErrors: typeof errors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Le nom est requis"
        }

        const lat = parseFloat(formData.latitude)
        const lng = parseFloat(formData.longitude)

        if (isNaN(lat) || lat < -90 || lat > 90) {
            newErrors.latitude = "La latitude doit être entre -90 et 90"
        }

        if (isNaN(lng) || lng < -180 || lng > 180) {
            newErrors.longitude = "La longitude doit être entre -180 et 180"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('YOUR_UPLOAD_ENDPOINT', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const data = await response.json()
            setFormData(prev => ({ ...prev, pictureUrl: data.url }))
            toast.success("Image téléchargée avec succès")
        } catch (error) {
            toast.error("Erreur lors du téléchargement de l'image")
            console.error("Failed to upload image:", error)
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            await updateMarket({
                marketId: market.marketId,
                updateData: {
                    ...formData,
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude)
                }
            }).unwrap()

            toast.success("Marché mis à jour avec succès")
            setIsOpen(false)
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du marché")
            console.error("Failed to update market:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Modifier
                    <FaEllipsisH className="ml-2" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="pb-4">
                    <DialogTitle className="font-medium">Modifier le marché</DialogTitle>
                    <DialogDescription className="font-normal">
                        Modifier les informations du marché afin de les mettre à jour.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Photo</Label>
                        <ImageUpload
                            value={formData.pictureUrl}
                            onChange={(url) => setFormData({ ...formData, pictureUrl: url })}
                            onDelete={() => setFormData({ ...formData, pictureUrl: "" })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nom du marché</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                            id="latitude"
                            type="text"
                            inputMode="decimal"
                            pattern="-?[0-9]*[.,]?[0-9]*"
                            value={formData.latitude}
                            onChange={(e) => {
                                const value = e.target.value.replace(',', '.')
                                if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                                    setFormData(prev => ({ ...prev, latitude: value }))
                                }
                            }}
                            className={errors.latitude ? "border-red-500" : ""}
                        />
                        {errors.latitude && <span className="text-sm text-red-500">{errors.latitude}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                            id="longitude"
                            type="text"
                            inputMode="decimal"
                            pattern="-?[0-9]*[.,]?[0-9]*"
                            value={formData.longitude}
                            onChange={(e) => {
                                const value = e.target.value.replace(',', '.')
                                if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                                    setFormData(prev => ({ ...prev, longitude: value }))
                                }
                            }}
                            className={errors.longitude ? "border-red-500" : ""}
                        />
                        {errors.longitude && <span className="text-sm text-red-500">{errors.longitude}</span>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) =>
                                setFormData(prev => ({ ...prev, isActive: checked as boolean }))
                            }
                        />
                        <Label htmlFor="isActive">Marché actif</Label>
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
