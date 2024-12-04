import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "../../../components/Header";
import { useGetAgentByIdQuery } from "@/redux/api/agent";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { TableCell, TableContainer, TableHeader, TableRow } from "@/components/Table";
import { Input } from "@/components/ui/input";
import AgentEditDialog from "../components/AgentEditDialog";

const AgentScreen = (): JSX.Element => {
    const { agentId } = useParams();
    const { data: agent, isLoading: agentLoading, error: agentError } = useGetAgentByIdQuery(agentId!);
    const [searchTerm, setSearchTerm] = useState("");

    if (agentLoading) {
        return <div>Loading...</div>;
    }

    if (agentError || !agent) {
        return <div>Error loading agent</div>;
    }

    return (
        <div className="flex flex-col justify-start items-start w-full h-full border border-slate-100">
            <HeaderContainer>
                <div>
                    <HeaderTitle>{agent.firstName} {agent.lastName}</HeaderTitle>
                    <HeaderSubtitle>Informations détaillées de l'agent</HeaderSubtitle>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <AgentEditDialog agent={agent} />
                </div>
            </HeaderContainer>

            <div className="flex flex-col gap-4 p-8 w-full">
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-medium">Informations générales</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <span className="text-sm text-gray-500">Email:</span>
                            <span className="text-sm">{agent.email}</span>
                            <span className="text-sm text-gray-500">Téléphone:</span>
                            <span className="text-sm">{agent.phone}</span>
                            <span className="text-sm text-gray-500">Marché:</span>
                            <span className="text-sm">{agent.marketId}</span>
                            <span className="text-sm text-gray-500">Date de création:</span>
                            <span className="text-sm">{new Date(agent.createdAt).toLocaleDateString()}</span>
                            <span className="text-sm text-gray-500">Dernière mise à jour:</span>
                            <span className="text-sm">{new Date(agent.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {agent.pictureUrl && (
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-medium">Photo de profil</h3>
                            <img
                                src={agent.pictureUrl}
                                alt={`${agent.firstName} ${agent.lastName}`}
                                className="object-cover w-full h-48 rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {agent.orders && agent.orders.length > 0 && (
                    <div className="flex flex-col gap-2 mt-8">
                        <h3 className="text-lg font-medium">Commandes</h3>
                        <Input
                            placeholder="Rechercher une commande..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                        <TableContainer>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableRow>
                            </TableHeader>
                            <tbody>
                                {agent.orders
                                    .filter(order => 
                                        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        order.status.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((order) => (
                                        <TableRow key={order.orderId}>
                                            <TableCell>{order.orderId}</TableCell>
                                            <TableCell>{new Date(order.createdAt?? new Date()).toLocaleDateString()}</TableCell>
                                            <TableCell>{order.status}</TableCell>
                                        </TableRow>
                                    ))}
                            </tbody>
                        </TableContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentScreen;
