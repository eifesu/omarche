"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Link from 'next/link';
import { Order, OrderDetails, useFetchOrdersQuery } from "@/redux/api/orders.api";

const OrdersPage = () => {
    const { data: orders, isLoading, error } = useFetchOrdersQuery();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error occurred</div>;

    const orderColumns: ColumnDef<OrderDetails>[] = [
        {
            accessorKey: "orderId",
            header: "Order ID",
            cell: ({ row }) => (
                <Link href={`/orders/${row.original.order.orderId}`} className="text-blue-600 hover:underline">
                    {row.original.order.orderId.substring(0, 8).toUpperCase()}
                </Link>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <OrderStatusBadge status={row.original.order.status} />
            ),
        },
        { accessorKey: "totalAmount", header: "Total Amount" },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => new Date(row.original.order.createdAt).toLocaleString(),
        },
        {
            accessorKey: "marketName",
            header: "Market",
            cell: ({ row }) => (
                <Link href={`/markets/${row.original.market.marketId}`} className="text-blue-600 hover:underline">
                    {row.original.marketName}
                </Link>
            ),
        },
    ];

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={orderColumns} data={orders || []} />
                </CardContent>
            </Card>
        </div>
    );
}

const OrderStatusBadge = ({ status }: { status: Order['status'] }) => {
    const statusConfig = {
        IDLE: { label: 'Idle', variant: 'secondary' },
        PROCESSING: { label: 'Processing', variant: 'warning' },
        PROCESSED: { label: 'Processed', variant: 'success' },
        COLLECTING: { label: 'Collecting', variant: 'warning' },
        DELIVERING: { label: 'Delivering', variant: 'warning' },
        DELIVERED: { label: 'Delivered', variant: 'success' },
        CANCELED: { label: 'Canceled', variant: 'destructive' },
    };

    const config = statusConfig[status] || { label: status, variant: 'default' };

    return (
        <Badge variant={config.variant as any}>
            {config.label}
        </Badge>
    );
};

export default OrdersPage;