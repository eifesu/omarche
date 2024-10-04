"use client"

import { useFetchMarketByIdQuery, useFetchOrdersByMarketIdQuery, useFetchSellersByMarketIdQuery } from "@/redux/api/markets.api";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table";
import Link from 'next/link';

const MarketPage = () => {
    const { id } = useParams();
    const { data: market, isLoading: isMarketLoading, error: marketError } = useFetchMarketByIdQuery(id as string);
    const { data: orders, isLoading: isOrdersLoading, error: ordersError } = useFetchOrdersByMarketIdQuery(id as string);
    const { data: sellers, isLoading: isSellersLoading, error: sellersError } = useFetchSellersByMarketIdQuery(id as string);

    if (isMarketLoading || isOrdersLoading || isSellersLoading) return <div>Loading...</div>;
    if (marketError || ordersError || sellersError) return <div>Error occurred</div>;
    if (!market) return <div>Market not found</div>;

    const orderColumns: ColumnDef<any>[] = [
        { accessorKey: "orderId", header: "Order ID" },
        { accessorKey: "status", header: "Status" },
        { accessorKey: "totalAmount", header: "Total Amount" },
        { accessorKey: "createdAt", header: "Created At" },
    ];

    const sellerColumns: ColumnDef<any>[] = [
        {
            accessorKey: "firstName",
            header: "First Name",
            cell: ({ row }) => (
                <Link href={`/sellers/${row.original.sellerId}`} className="text-blue-600 hover:underline">
                    {row.original.firstName}
                </Link>
            ),
        },
        { accessorKey: "lastName", header: "Last Name" },
        { accessorKey: "tableNumber", header: "Table Number" },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.isActive ? "default" : "secondary"}>
                    {row.original.isActive ? "Active" : "Inactive"}
                </Badge>
            ),
        },
    ];

    return (
        <div className="container mx-auto py-10">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>{market.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p><strong>ID:</strong> {market.marketId}</p>
                            <p><strong>Latitude:</strong> {market.latitude}</p>
                            <p><strong>Longitude:</strong> {market.longitude}</p>
                        </div>
                        <div>
                            <p><strong>Status:</strong>
                                <Badge variant={market.isActive ? "default" : "secondary"} className="ml-2">
                                    {market.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </p>
                            {market.pictureUrl && (
                                <Avatar className="w-24 h-24 mt-4">
                                    <AvatarImage src={market.pictureUrl} alt={market.name} />
                                    <AvatarFallback>{market.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="orders" className="w-full">
                <TabsList>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="sellers">Sellers</TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                    <Card>
                        <CardHeader>
                            <CardTitle>Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={orderColumns} data={orders || []} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="sellers">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sellers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={sellerColumns} data={sellers || []} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default MarketPage;