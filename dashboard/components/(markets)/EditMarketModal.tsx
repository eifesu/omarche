import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Market, useUpdateMarketMutation } from "@/redux/api/markets.api"
import { Edit } from "lucide-react"

interface EditMarketModalProps {
    market: Market
}

export function EditMarketModal({ market }: EditMarketModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState(market.name)
    const [latitude, setLatitude] = useState(market.latitude.toString())
    const [longitude, setLongitude] = useState(market.longitude.toString())
    const [updateMarket] = useUpdateMarketMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await updateMarket({
                marketId: market.marketId,
                name,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            }).unwrap()
            setIsOpen(false)
        } catch (error) {
            console.error("Failed to update market:", error)
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
                    <DialogTitle>Edit Market</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="latitude" className="text-right">
                            Latitude
                        </Label>
                        <Input
                            id="latitude"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="longitude" className="text-right">
                            Longitude
                        </Label>
                        <Input
                            id="longitude"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
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
