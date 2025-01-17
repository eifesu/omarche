import {
  HeaderContainer,
  HeaderSubtitle,
  HeaderTitle,
} from "../../../components/Header";
import {
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import MarketEditDialog from "../components/MarketEditDialog";
import { Input } from "@/components/ui/input";
import { useGetAllMarketsQuery } from "@/redux/api/market";
import MarketCreateDialog from "../components/MarketCreateDialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "@/redux/slices/authSlice";
import { useSelector } from "react-redux";

export const getAreaLabel = (code: string) => {
  const areaLabels: Record<string, string> = {
    ABOBO: "Abobo",
    ADJAME: "Adjamé",
    ATTECOUBE: "Attécoubé",
    COCODY: "Cocody",
    KOUMASSI: "Koumassi",
    MARCORY: "Marcory",
    PLATEAU: "Plateau",
    TREICHVILLE: "Treichville",
    YOPOUGON: "Yopougon",
    BROFODOUME: "Brofodoumé",
    BINGERVILLE: "Bingerville",
    PORT_BOUET: "Port-Bouët",
    ANYAMA: "Anyama",
    SONGON: "Songon",
  };
  return areaLabels[code] || code;
};

const MarketsScreen = (): JSX.Element => {
  const user = useSelector(selectCurrentUser)!;
  const { data: markets, isLoading, error } = useGetAllMarketsQuery(user.areaCode ?? undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading markets</div>;
  }

  const filteredMarkets = markets?.filter(
    (market) =>
      market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.latitude.toString().includes(searchTerm) ||
      market.longitude.toString().includes(searchTerm) ||
      getAreaLabel(market.areaCode)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col justify-start items-start w-full h-full border border-slate-100">
      <HeaderContainer>
        <div>
          <HeaderTitle>Marchés</HeaderTitle>
          <HeaderSubtitle>
            Liste des marchés disponibles sur la plateforme et informations
          </HeaderSubtitle>
        </div>
        <div className="flex flex-row gap-4 justify-center items-center">
          <Input
            type="text"
            placeholder="Rechercher un marché"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MarketCreateDialog />
        </div>
      </HeaderContainer>
      <TableContainer>
        <TableRow className="bg-slate-50">
          <TableHeader>NOM</TableHeader>
          <TableHeader>ZONE</TableHeader>
          <TableHeader>LATITUDE</TableHeader>
          <TableHeader>LONGITUDE</TableHeader>
          <TableHeader>ACTIF</TableHeader>
          <TableHeader>ACTIONS</TableHeader>
        </TableRow>
        {filteredMarkets?.map((market) => (
          <TableRow
            key={market.marketId}
            className="cursor-pointer hover:bg-slate-50"
            onClick={() => navigate(`/markets/${market.marketId}`)}
          >
            <TableCell>{market.name}</TableCell>
            <TableCell>{getAreaLabel(market.areaCode)}</TableCell>
            <TableCell>{market.latitude}</TableCell>
            <TableCell>{market.longitude}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  market.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {market.isActive ? "Actif" : "Inactif"}
              </span>
            </TableCell>
            <TableCell className="flex flex-row gap-4 justify-start items-center">
              <MarketEditDialog market={market} />
            </TableCell>
          </TableRow>
        ))}
      </TableContainer>
    </div>
  );
};

export default MarketsScreen;
