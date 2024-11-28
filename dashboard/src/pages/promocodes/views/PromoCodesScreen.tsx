import { useState } from "react";
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "@/components/Header";
import { TableCell, TableContainer, TableHeader, TableRow } from "@/components/Table";
import { Input } from "@/components/ui/input";
import { useGetAllPromoCodesQuery } from "@/redux/api/promocode";
import PromoCodeCreateDialog from "../components/PromoCodeCreateDialog";
import PromoCodeEditDialog from "../components/PromoCodeEditDialog";

const PromoCodesScreen = (): JSX.Element => {
    const { data: promoCodes, isLoading, error } = useGetAllPromoCodesQuery();
    const [searchTerm, setSearchTerm] = useState("");

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading promo codes</div>;
    }

    const filteredPromoCodes = promoCodes?.filter(promoCode =>
        promoCode.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promoCode.amount.toString().includes(searchTerm)
    );


    const formatDiscount = (amount: number, type: string) => {
        return type === 'PERCENTAGE' ? `${amount}%` : `${amount} FCFA`;
    };

    return <div className="flex flex-col justify-start items-start w-full h-full border border-slate-100">
        <HeaderContainer>
            <div>
                <HeaderTitle>Codes Promo</HeaderTitle>
                <HeaderSubtitle>Liste des codes promo disponibles sur la plateforme et informations</HeaderSubtitle>
            </div>
            <div className="flex flex-row gap-4 justify-center items-center">
                <Input
                    type="text"
                    placeholder="Rechercher un code promo"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <PromoCodeCreateDialog />
            </div>
        </HeaderContainer>
        <TableContainer>
            <TableRow className="bg-slate-50">
                <TableHeader>CODE</TableHeader>
                <TableHeader>RÉDUCTION</TableHeader>
                <TableHeader>TYPE</TableHeader>
                <TableHeader>EXPIRATION</TableHeader>
                <TableHeader>ACTIONS</TableHeader>
            </TableRow>
            {filteredPromoCodes?.map((promoCode) => (
                <TableRow
                    key={promoCode.promoCodeId}
                    className="hover:bg-slate-50"
                >
                    <TableCell>{promoCode.code}</TableCell>
                    <TableCell>{formatDiscount(promoCode.amount, promoCode.discountType)}</TableCell>
                    <TableCell>{promoCode.discountType === 'PERCENTAGE' ? 'Pourcentage' : 'Montant fixe'}</TableCell>
                    <TableCell>{new Date(promoCode.expiration).toLocaleDateString()}</TableCell>
                    <TableCell className="flex flex-row gap-4 justify-start items-center">
                        <PromoCodeEditDialog promoCode={promoCode} />
                    </TableCell>
                </TableRow>
            ))}
        </TableContainer>
    </div>
}

export default PromoCodesScreen; 