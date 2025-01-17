import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "../../../components/Header";
import { TableCell, TableContainer, TableHeader, TableRow } from "../../../components/Table";
import { Input } from "@/components/ui/input";
import { User, useGetAllUsersQuery } from "@/redux/api/user";
import { useState } from "react";
import UserCreateDialog from "../components/UserCreateDialog";
import UserEditDialog from "../components/UserEditDialog";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/slices/authSlice";

const UsersScreen = (): JSX.Element => {
    const currentUser = useSelector(selectCurrentUser)!;
    const { data: users, isLoading, error } = useGetAllUsersQuery();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading users</div>;
    }

    const filteredUsers = users?.filter(user =>
        user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUserClick = (userId: string) => {
        navigate(`/users/${userId}`);
    };

    return <div className="flex flex-col justify-start items-start w-full h-full border border-slate-100">
        <HeaderContainer>
            <div>
                <HeaderTitle>Utilisateurs</HeaderTitle>
                <HeaderSubtitle>Liste des utilisateurs enregistrés sur la plateforme</HeaderSubtitle>
            </div>
            <div className="flex flex-row gap-4 justify-center items-center">
                <Input
                    type="text"
                    placeholder="Rechercher un utilisateur"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <UserCreateDialog />
            </div>
        </HeaderContainer>
        <TableContainer>
            <TableRow className="bg-slate-50">
                <TableHeader>ID</TableHeader>
                <TableHeader>NOM</TableHeader>
                <TableHeader>EMAIL</TableHeader>
                <TableHeader>VILLE</TableHeader>
                <TableHeader>TÉLÉPHONE</TableHeader>
                <TableHeader>ACTIONS</TableHeader>
            </TableRow>
            {filteredUsers?.map((user: User) => (
                <TableRow
                    key={user.userId}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleUserClick(user.userId)}
                >
                    <TableCell>{user.userId.slice(0, 8)}</TableCell>
                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.city || '-'}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                        <UserEditDialog user={user} />
                    </TableCell>
                </TableRow>
            ))}
        </TableContainer>
    </div>
}

export default UsersScreen;
