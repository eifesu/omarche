import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "@/components/Header";
import { TableCell, TableContainer, TableHeader, TableRow } from "@/components/Table";
import { Input } from "@/components/ui/input";
import { useGetAllShippersQuery } from "@/redux/api/shipper";
import { useGetAllMarketsQuery } from "@/redux/api/market";
import { useState } from "react";
import ShipperCreateDialog from "../components/ShipperCreateDialog";
import { useNavigate } from "react-router-dom";
import { ShipperEditDialog } from "../components/ShipperEditDialog";

const ShippersScreen = (): JSX.Element => {
    const { data: shippers, isLoading: shippersLoading, error: shippersError } = useGetAllShippersQuery();
    const { data: markets, isLoading: marketsLoading } = useGetAllMarketsQuery();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    if (shippersLoading || marketsLoading) {
        return <div>Loading...</div>;
    }

    if (shippersError) {
        return <div>Error loading shippers</div>;
    }

    const marketMap = markets?.reduce((acc, market) => {
        acc[market.marketId] = market.name;
        return acc;
    }, {} as { [key: string]: string });

    const filteredShippers = shippers?.filter(shipper =>
        shipper.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipper.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipper.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipper.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleShipperClick = (shipperId: string) => {
        navigate(`/shippers/${shipperId}`);
    };

    return (
        <div className="flex flex-col justify-start items-start w-full h-full border border-slate-100">
            <HeaderContainer>
                <div>
                    <HeaderTitle>Livreurs</HeaderTitle>
                    <HeaderSubtitle>Liste des livreurs disponibles sur la plateforme</HeaderSubtitle>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <Input
                        type="text"
                        placeholder="Rechercher un livreur"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ShipperCreateDialog />
                </div>
            </HeaderContainer>

            <TableContainer>
                <TableRow className="bg-slate-50">
                    <TableHeader>NOM</TableHeader>
                    <TableHeader>PRÉNOM</TableHeader>
                    <TableHeader>EMAIL</TableHeader>
                    <TableHeader>TÉLÉPHONE</TableHeader>
                    <TableHeader>MARCHÉ</TableHeader>
                    <TableHeader>STATUT</TableHeader>
                    <TableHeader>ACTIONS</TableHeader>
                </TableRow>
                {filteredShippers?.map((shipper) => (
                    <TableRow
                        key={shipper.shipperId}
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => handleShipperClick(shipper.shipperId)}
                    >
                        <TableCell>{shipper.lastName}</TableCell>
                        <TableCell>{shipper.firstName}</TableCell>
                        <TableCell>{shipper.email}</TableCell>
                        <TableCell>{shipper.phone}</TableCell>
                        <TableCell>{marketMap?.[shipper.marketId] || "N/A"}</TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${shipper.isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {shipper.isOnline ? 'En ligne' : 'Hors ligne'}
                            </span>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                            <ShipperEditDialog shipper={shipper} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableContainer>
        </div>
    );
};

export default ShippersScreen;