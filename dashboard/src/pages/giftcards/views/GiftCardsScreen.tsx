import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "../../../components/Header";
import { TableCell, TableContainer, TableHeader, TableRow } from "../../../components/Table";
import { Input } from "@/components/ui/input";
import { useGetAllGiftCardsQuery } from "@/redux/api/giftcard";
import { useState } from "react";

const GiftCardsScreen = (): JSX.Element => {
    const { data: giftCards, isLoading, error } = useGetAllGiftCardsQuery();
    const [searchTerm, setSearchTerm] = useState("");

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading gift cards</div>;
    }

    const filteredGiftCards = giftCards?.filter(card =>
        card.giftCardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.expiration.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return <div className="flex flex-col justify-start items-start w-full h-full border border-slate-100">
        <HeaderContainer >
            <div>
                <HeaderTitle>Cartes cadeaux</HeaderTitle>
                <HeaderSubtitle>Liste des cartes cadeaux disponibles sur la plateforme</HeaderSubtitle>
            </div>
            <div className="flex flex-row gap-4 justify-center items-center">
                <Input
                    type="text"
                    placeholder="Rechercher une carte cadeau"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </HeaderContainer>
        <TableContainer>
            <TableRow className="bg-slate-50">
                <TableHeader>ID</TableHeader>
                <TableHeader>UTILISATEUR</TableHeader>
                <TableHeader>EXPIRATION</TableHeader>
                <TableHeader>STATUT</TableHeader>
            </TableRow>
            {filteredGiftCards?.map((card) => (
                <TableRow
                    key={card.giftCardId}
                    className="cursor-pointer hover:bg-slate-50"
                >
                    <TableCell>{card.giftCardId.slice(0, 8)}</TableCell>
                    <TableCell>{card.userId ? card.userId.slice(0, 8) : 'N/A'}</TableCell>
                    <TableCell>{new Date(card.expiration).toLocaleDateString()}</TableCell>
                    <TableCell>{card.status}</TableCell>
                </TableRow>
            ))}
        </TableContainer>
    </div>
}

export default GiftCardsScreen; 