import { useState } from "react";
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "@/components/Header";
import { TableCell, TableContainer, TableHeader, TableRow } from "@/components/Table";
import { Input } from "@/components/ui/input";
import { useGetAllAgentsQuery } from "@/redux/api/agent";
import { useGetAllMarketsQuery } from "@/redux/api/market";
import AgentCreateDialog from "../components/AgentCreateDialog";
import AgentEditDialog from "../components/AgentEditDialog";
import { useNavigate } from "react-router-dom";

const AgentsScreen = (): JSX.Element => {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: agents, isLoading: agentsLoading, error: agentsError } = useGetAllAgentsQuery();
    const { data: markets, isLoading: marketsLoading } = useGetAllMarketsQuery();
    const navigate = useNavigate();

    if (agentsLoading || marketsLoading) {
        return <div>Loading...</div>;
    }

    if (agentsError) {
        return <div>Error loading agents</div>;
    }

    const marketMap = markets?.reduce((acc, market) => {
        acc[market.marketId] = market.name;
        return acc;
    }, {} as { [key: string]: string });

    const filteredAgents = agents?.filter((agent) =>
        `${agent.firstName} ${agent.lastName} ${agent.email} ${agent.phone}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col justify-start items-start w-full h-full border border-slate-100">
            <HeaderContainer>
                <div>
                    <HeaderTitle>Agents</HeaderTitle>
                    <HeaderSubtitle>Gérez les gestionnaires de commande</HeaderSubtitle>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <Input
                        type="text"
                        placeholder="Rechercher un agent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <AgentCreateDialog />
                </div>
            </HeaderContainer>

            <TableContainer>
                <TableRow className="bg-slate-50">
                    <TableHeader>NOM</TableHeader>
                    <TableHeader>PRÉNOM</TableHeader>
                    <TableHeader>EMAIL</TableHeader>
                    <TableHeader>TÉLÉPHONE</TableHeader>
                    <TableHeader>MARCHÉ</TableHeader>
                    <TableHeader>ACTIONS</TableHeader>
                </TableRow>
                {filteredAgents?.map((agent) => (
                    <TableRow
                        key={agent.agentId}
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => navigate(`/agents/${agent.agentId}`)}
                    >
                        <TableCell>{agent.lastName}</TableCell>
                        <TableCell>{agent.firstName}</TableCell>
                        <TableCell>{agent.email}</TableCell>
                        <TableCell>{agent.phone}</TableCell>
                        <TableCell>{marketMap?.[agent.marketId] || "N/A"}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                            <AgentEditDialog agent={agent} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableContainer>
        </div>
    );
};

export default AgentsScreen;