"use client"
import { useFetchMarketsQuery } from "@/redux/api/markets.api";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus } from "lucide-react";
import { EditMarketModal } from "@/components/(markets)/EditMarketModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddMarketModal } from "@/components/(markets)/AddMarketModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const MarketsPage = () => {
    const { data: markets, isLoading, error, refetch } = useFetchMarketsQuery();
    const [searchTerm, setSearchTerm] = useState("");

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen">Error: {error.toString()}</div>;

    const filteredMarkets = markets?.filter(market =>
        market.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold">Marchés</h1>
                <AddMarketModal />
            </div>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Rechercher un marché</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="Rechercher par nom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMarkets?.map((market) => (
                    <Card key={market.marketId} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-2xl font-bold">{market.name}</CardTitle>
                            <Avatar>
                                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${market.name}`} />
                                <AvatarFallback>{market.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col space-y-2">
                                <p>Latitude: {market.latitude}, Longitude: {market.longitude}</p>
                                <Badge variant={market.isActive ? "default" : "destructive"} className="w-fit">
                                    {market.isActive ? 'Actif' : 'Inactif'}
                                </Badge>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <EditMarketModal market={market} />
                                <Link href={`/markets/${market.marketId}`}>
                                    <Button variant="secondary">Voir</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}

export default MarketsPage;