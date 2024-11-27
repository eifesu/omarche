import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "../../../components/Header";
import { TableCell, TableContainer, TableHeader, TableRow } from "../../../components/Table";
import { Input } from "@/components/ui/input";
import { useGetAllOrdersQuery } from "@/redux/api/order";
import { useState } from "react";
import OrderCreateDialog from "../components/OrderCreateDialog";
import OrderEditDialog from "../components/OrderEditDialog";
import { useNavigate } from "react-router-dom";

const OrdersScreen = (): JSX.Element => {
    const { data: orders, isLoading, error } = useGetAllOrdersQuery();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading orders</div>;
    }

    const filteredOrders = orders?.filter(order =>
        order.order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOrderClick = (orderId: string) => {
        navigate(`/orders/${orderId}`);
    };

    return <div className="flex flex-col justify-start items-start w-full h-full border border-slate-100">
        <HeaderContainer >
            <div>
                <HeaderTitle>Commandes</HeaderTitle>
                <HeaderSubtitle>Liste des commandes disponibles sur la plateforme et informations</HeaderSubtitle>
            </div>
            <div className="flex flex-row gap-4 justify-center items-center">
                <Input
                    type="text"
                    placeholder="Rechercher une commande"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <OrderCreateDialog />
            </div>
        </HeaderContainer>
        <TableContainer>
            <TableRow className="bg-slate-50">
                <TableHeader>ID</TableHeader>
                <TableHeader>UTILISATEUR</TableHeader>
                <TableHeader>ADRESSE</TableHeader>
                <TableHeader>HEURE DE LIVRAISON</TableHeader>
                <TableHeader>STATUT</TableHeader>
                <TableHeader>MARCHÉ</TableHeader>
                <TableHeader>ACTIONS</TableHeader>
            </TableRow>
            {filteredOrders?.map((order) => (
                <TableRow
                    key={order.order.orderId}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleOrderClick(order.order.orderId)}
                >
                    <TableCell>{order.order.orderId.slice(0, 8)}</TableCell>
                    <TableCell>{order.order.userId.slice(0, 8)}</TableCell>
                    <TableCell>{order.order.address}</TableCell>
                    <TableCell>{order.order.deliveryTime}</TableCell>
                    <TableCell>{order.order.status}</TableCell>
                    <TableCell>{order.marketName}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                        <OrderEditDialog order={order.order} />
                    </TableCell>
                </TableRow>
            ))}
        </TableContainer>
    </div>
}

export default OrdersScreen; 