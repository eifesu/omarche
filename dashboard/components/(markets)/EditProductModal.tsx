import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from "lucide-react"
import { Product, useUpdateProductByIdMutation } from "@/redux/api/products.api"

interface EditProductModalProps {
    product: Product
}

export function EditProductModal({ product }: EditProductModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState(product.name)
    const [price, setPrice] = useState(product.price.toString())
    const [amount, setAmount] = useState(product.amount.toString())
    const [unit, setUnit] = useState(product.unit)
    const [updateProduct] = useUpdateProductByIdMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await updateProduct({
                productId: product.productId,
                name,
                price: parseFloat(price),
                amount: parseFloat(amount),
                unit,
            }).unwrap()
            setIsOpen(false)
        } catch (error) {
            console.error("Failed to update product:", error)
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
                    <DialogTitle>Edit Product</DialogTitle>
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
                        <Label htmlFor="price" className="text-right">
                            Price
                        </Label>
                        <Input
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="col-span-3"
                            type="number"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="col-span-3"
                            type="number"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="unit" className="text-right">
                            Unit
                        </Label>
                        <Input
                            id="unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
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