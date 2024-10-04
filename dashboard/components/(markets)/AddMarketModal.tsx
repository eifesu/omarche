import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Market, useCreateMarketMutation } from "@/redux/api/markets.api"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AddMarketModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [createMarket] = useCreateMarketMutation()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createMarket({
                name,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            }).unwrap()
            setIsOpen(false)
            toast({
                title: "Market created",
                description: "The new market has been successfully added.",
            })
        } catch (error) {
            console.error("Failed to create market:", error)
            toast({
                title: "Error",
                description: "Failed to create the market. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Market
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Market</DialogTitle>
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
                        Create Market
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}