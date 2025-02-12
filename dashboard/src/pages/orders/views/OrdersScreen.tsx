import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "../../../components/Header";
import { TableCell, TableContainer, TableHeader, TableRow } from "../../../components/Table";
import { Input } from "@/components/ui/input";
import { useGetAllOrdersQuery } from "@/redux/api/order";
import { useState } from "react";
import OrderCreateDialog from "../components/OrderCreateDialog";
import OrderEditDialog from "../components/OrderEditDialog";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/slices/authSlice";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

const OrdersScreen = (): JSX.Element => {
    const user = useSelector(selectCurrentUser)!;
    const { data: orders, isLoading, error } = useGetAllOrdersQuery(user.areaCode ?? undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
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

    const totalItems = filteredOrders?.length || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filteredOrders?.slice(startIndex, endIndex);

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

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
            {currentItems?.map((order) => (
                <TableRow
                    key={order.order.orderId}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleOrderClick(order.order.orderId)}
                >
                    <TableCell>{order.order.orderId.slice(0, 8)}</TableCell>
                    <TableCell>{order.order.userId.slice(0, 8)}</TableCell>
                    <TableCell>{order.order.address}</TableCell>
                    <TableCell>{order.order.deliveryTime}</TableCell>
                    <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                            order.order.status === "IDLE" ? 'bg-gray-100 text-gray-800' :
                            order.order.status === "PROCESSING" || order.order.status === "PROCESSED" ? 'bg-blue-100 text-blue-800' :
                            order.order.status === "COLLECTING" ? 'bg-yellow-100 text-yellow-800' :
                            order.order.status === "DELIVERING" ? 'bg-purple-100 text-purple-800' :
                            order.order.status === "DELIVERED" ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                            {order.order.status}
                        </span>
                    </TableCell>
                    <TableCell>{order.marketName}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                        <OrderEditDialog order={order.order} />
                    </TableCell>
                </TableRow>
            ))}
        </TableContainer>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center px-8 py-4 w-full border-t">
            <div className="flex justify-start items-center text-sm w-fit text-muted-foreground">
                Page {currentPage} sur {totalPages}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(1)}
                        disabled={!canGoPrevious}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!canGoPrevious}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!canGoNext}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={!canGoNext}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
}

export default OrdersScreen;