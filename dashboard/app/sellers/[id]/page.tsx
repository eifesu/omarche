"use client"

import { useFetchSellerByIdQuery, useFetchProductsBySellerIdQuery, useUpdateSellerByIdMutation } from "@/redux/api/sellers.api";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { EditSellerModal } from "@/components/(markets)/EditSellerModal";
import { EditProductModal } from "@/components/(markets)/EditProductModal";

const SellerPage = () => {
    const { id } = useParams();
    const { data: seller, isLoading: isSellerLoading, error: sellerError } = useFetchSellerByIdQuery(id as string);
    const { data: products, isLoading: isProductsLoading, error: productsError } = useFetchProductsBySellerIdQuery(id as string);
    const [updateSeller] = useUpdateSellerByIdMutation();

    if (isSellerLoading || isProductsLoading) return <div>Loading...</div>;
    if (sellerError || productsError) return <div>Error occurred</div>;
    if (!seller) return <div>Seller not found</div>;

    const handleToggleActive = async () => {
        try {
            await updateSeller({
                sellerId: seller.sellerId,
                isActive: !seller.isActive,
            }).unwrap();
        } catch (error) {
            console.error("Failed to update seller status:", error);
        }
    };

    const productColumns: ColumnDef<any>[] = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "price", header: "Price" },
        { accessorKey: "amount", header: "Amount" },
        { accessorKey: "unit", header: "Unit" },
        {
            accessorKey: "isInStock",
            header: "Stock Status",
            cell: ({ row }) => (
                <Badge variant={row.original.isInStock ? "default" : "secondary"}>
                    {row.original.isInStock ? "In Stock" : "Out of Stock"}
                </Badge>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <EditProductModal product={row.original} />
            ),
        },
    ];

    return (
        <div className="container mx-auto py-10">
            <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{seller.firstName} {seller.lastName}</CardTitle>
                    <div className="flex space-x-2">
                        <EditSellerModal seller={seller} />
                        <Badge
                            variant={seller.isActive ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={handleToggleActive}
                        >
                            {seller.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p><strong>ID:</strong> {seller.sellerId}</p>
                            <p><strong>Gender:</strong> {seller.gender}</p>
                            <p><strong>Table Number:</strong> {seller.tableNumber}</p>
                        </div>
                        <div>
                            {seller.pictureUrl && (
                                <Avatar className="w-24 h-24 mt-4">
                                    <AvatarImage src={seller.pictureUrl} alt={`${seller.firstName} ${seller.lastName}`} />
                                    <AvatarFallback>{seller.firstName.charAt(0)}{seller.lastName.charAt(0)}</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={productColumns} data={products || []} />
                </CardContent>
            </Card>
        </div>
    );
}

export default SellerPage;