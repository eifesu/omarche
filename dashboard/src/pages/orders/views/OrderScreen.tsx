import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "../../../components/Header";
import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "@/redux/api/order";
import OrderEditDialog from "../components/OrderEditDialog";
import { TableCell, TableContainer, TableHeader, TableRow } from "@/components/Table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const OrderScreen = (): JSX.Element => {
    const { orderId } = useParams();
    const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId!);
    const [searchTerm, setSearchTerm] = useState("");

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !order) {
        return <div>Error loading order</div>;
    }

    const filteredProducts = order.orderProducts?.filter(product =>
        product.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product.price.toString().includes(searchTerm) ||
        product.quantity.toString().includes(searchTerm)
    );

    return (
        <div className="flex flex-col justify-start items-start w-full h-full border border-slate-100">
            <HeaderContainer>
                <div>
                    <HeaderTitle>Commande #{order.order.orderId.slice(0, 8)}</HeaderTitle>
                    <HeaderSubtitle>Informations détaillées de la commande</HeaderSubtitle>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <OrderEditDialog order={order.order} />
                </div>
            </HeaderContainer>

            <div className="flex flex-col gap-4 p-8 w-full">
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-medium">Informations générales</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <span className="text-sm text-gray-500">Status:</span>
                            <span className={`w-fit px-2 py-1 rounded-full text-xs ${
                                order.order.status === "IDLE" ? 'bg-gray-100 text-gray-800' :
                                order.order.status === "PROCESSING" || order.order.status === "PROCESSED" ? 'bg-blue-100 text-blue-800' :
                                order.order.status === "COLLECTING" ? 'bg-yellow-100 text-yellow-800' :
                                order.order.status === "DELIVERING" ? 'bg-purple-100 text-purple-800' :
                                order.order.status === "DELIVERED" ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {order.order.status}
                            </span>
                            <span className="text-sm text-gray-500">Client ID:</span>
                            <span className="text-sm">{order.order.userId}</span>
                            <span className="text-sm text-gray-500">Agent ID:</span>
                            <span className="text-sm">{order.order.agentId ? order.order.agentId : 'N/A'}</span>
                            <span className="text-sm text-gray-500">Livreur ID:</span>
                            <span className="text-sm">{order.order.shipperId ? order.order.shipperId : 'N/A'}</span>
                            <span className="text-sm text-gray-500">Adresse:</span>
                            <span className="text-sm">{order.order.address}</span>
                            <span className="text-sm text-gray-500">Heure de livraison:</span>
                            <span className="text-sm">{order.order.deliveryTime}</span>
                            <span className="text-sm text-gray-500">Méthode de paiement:</span>
                            <span className="text-sm">{order.order.paymentMethod}</span>
                            {order.order.promoCode && (
                                <>
                                    <span className="text-sm text-gray-500">Code promo:</span>
                                    <span className="text-sm">{order.order.promoCode.code}</span>
                                </>
                            )}
                            {order.order.cancellationReason && (
                                <>
                                    <span className="text-sm text-gray-500">Raison d'annulation:</span>
                                    <span className="text-sm">{order.order.cancellationReason}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-medium">Localisation</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <span className="text-sm text-gray-500">Latitude:</span>
                            <span className="text-sm">{order.order.locationX}</span>
                            <span className="text-sm text-gray-500">Longitude:</span>
                            <span className="text-sm">{order.order.locationY}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Produits commandés</h3>
                        <div className="flex gap-4 items-center">
                            <Input
                                type="text"
                                placeholder="Rechercher un produit"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <TableContainer>
                        <TableRow className="bg-slate-50">
                            <TableHeader>NOM</TableHeader>
                            <TableHeader>PRIX UNITAIRE</TableHeader>
                            <TableHeader>QUANTITÉ</TableHeader>
                            <TableHeader>TOTAL</TableHeader>
                            <TableHeader>VENDEUR</TableHeader>
                        </TableRow>
                        {filteredProducts?.map((product) => (
                            <TableRow key={product.product.productId}>
                                <TableCell>{product.product.name}</TableCell>
                                <TableCell>{product.product.price} XOF</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>{(product.product.price * product.quantity).toFixed(2)} XOF</TableCell>
                                <TableCell>{product.sellerName}</TableCell>
                            </TableRow>
                        ))}
                    </TableContainer>
                </div>
            </div>
        </div>
    );
};

export default OrderScreen; 