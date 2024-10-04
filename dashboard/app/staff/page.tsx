"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetchAgentsQuery, useFetchShippersQuery } from '@/redux/api/staff.api';
import { EditStaffModal } from '@/components/(staff)/EditStaffModal';
import { DeleteStaffModal } from '@/components/(staff)/DeleteStaffModal';
import { AddStaffModal } from '@/components/(staff)/AddStaffModal';

const StaffPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: agents, isLoading: isAgentsLoading, refetch: refetchAgents } = useFetchAgentsQuery();
    const { data: shippers, isLoading: isShippersLoading, refetch: refetchShippers } = useFetchShippersQuery();

    if (isAgentsLoading || isShippersLoading) return <div>Loading...</div>;

    const filteredAgents = agents?.filter(agent =>
        agent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredShippers = shippers?.filter(shipper =>
        shipper.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipper.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipper.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const agentColumns: ColumnDef<any>[] = [
        { accessorKey: "firstName", header: "First Name" },
        { accessorKey: "lastName", header: "Last Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "phone", header: "Phone" },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <EditStaffModal staff={row.original} type="agent" onSuccess={refetchAgents} />
                    <DeleteStaffModal staff={row.original} type="agent" onSuccess={refetchAgents} />
                </div>
            ),
        },
    ];

    const shipperColumns: ColumnDef<any>[] = [
        { accessorKey: "firstName", header: "First Name" },
        { accessorKey: "lastName", header: "Last Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "phone", header: "Phone" },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <EditStaffModal staff={row.original} type="shipper" onSuccess={refetchShippers} />
                    <DeleteStaffModal staff={row.original} type="shipper" onSuccess={refetchShippers} />
                </div>
            ),
        },
    ];

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-extrabold mb-8">Staff Management</h1>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Search Staff</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </CardContent>
            </Card>
            <Tabs defaultValue="agents">
                <TabsList>
                    <TabsTrigger value="agents">Agents</TabsTrigger>
                    <TabsTrigger value="shippers">Shippers</TabsTrigger>
                </TabsList>
                <TabsContent value="agents">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Agents</CardTitle>
                            <AddStaffModal type="agent" onSuccess={refetchAgents} />
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={agentColumns} data={filteredAgents || []} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="shippers">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Shippers</CardTitle>
                            <AddStaffModal type="shipper" onSuccess={refetchShippers} />
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={shipperColumns} data={filteredShippers || []} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default StaffPage;