import { useState } from "react"
import { useCreateMarketMutation } from "@/redux/api/market"
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
import { FaPlus } from "react-icons/fa"
import { FaImage } from "react-icons/fa6"
import { ImageUpload } from "@/components/ui/image-upload"

export default function MarketCreateDialog() {
    const [createMarket] = useCreateMarketMutation()
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        latitude: "0",
        longitude: "0",
        pictureUrl: undefined as string | undefined
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
            await createMarket({
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            }).unwrap()
            toast.success("Marché créé avec succès")
            setIsOpen(false)
            setFormData({
                name: "",
                latitude: "0",
                longitude: "0",
                pictureUrl: undefined
            })
        } catch (error) {
            toast.error("Erreur lors de la création du marché")
            console.error("Failed to create market:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-orange-400 hover:bg-orange-500">
                    Ajouter un marché
                    <FaPlus className="ml-2" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un marché</DialogTitle>
                    <DialogDescription>
                        Remplissez tous les champs pour créer un nouveau marché.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label>Photo</Label>
                        <ImageUpload
                            value={formData.pictureUrl}
                            onChange={(url) => setFormData({ ...formData, pictureUrl: url })}
                            onDelete={() => setFormData({ ...formData, pictureUrl: "" })}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="name" className="text-right">
                            Nom
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className={`col-span-3 ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="latitude" className="text-right">
                            Latitude
                        </Label>
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
                            className={`col-span-3 ${errors.latitude ? 'border-red-500' : ''}`}
                        />
                        {errors.latitude && <p className="text-red-500">{errors.latitude}</p>}
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <Label htmlFor="longitude" className="text-right">
                            Longitude
                        </Label>
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
                            className={`col-span-3 ${errors.longitude ? 'border-red-500' : ''}`}
                        />
                        {errors.longitude && <p className="text-red-500">{errors.longitude}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>
                        Ajouter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
