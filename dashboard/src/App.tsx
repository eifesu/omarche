import { Outlet, useNavigate } from 'react-router-dom';
import './App.css'
import NavigationBar, { NavigationButton, NavigationLink, NavigationLinkContainer, NavigationLogo } from './components/Navigation'
import { FaCreditCard, FaDoorOpen, FaListCheck, FaReceipt, FaShop, FaTags, FaTruck } from "react-icons/fa6";
import { Toaster, toast } from 'sonner';
import Footer from './components/Footer';
import { useLogoutMutation } from './redux/api/auth';

function App() {
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('token');
            navigate('/login');
            toast.success('Déconnexion réussie');
        } catch (error) {
            toast.error('Erreur lors de la déconnexion');
        }
    };

    return (
        <main className='flex flex-col justify-center items-center h-svh w-svw'>
            <Toaster toastOptions={{ className: "font-mono" }} />
            <NavigationBar>
                <NavigationLogo />
                <NavigationLinkContainer to="/markets">
                    <FaShop />
                    <NavigationLink>Marchés</NavigationLink>
                </NavigationLinkContainer>
                <NavigationLinkContainer to="/orders">
                    <FaReceipt />
                    <NavigationLink>Commandes</NavigationLink>
                </NavigationLinkContainer>
                <NavigationLinkContainer to="/cards" hideForAreaAdmin>
                    <FaCreditCard />
                    <NavigationLink>Cartes</NavigationLink>
                </NavigationLinkContainer>
                <NavigationLinkContainer to="/promo-codes" hideForAreaAdmin>
                    <FaTags />
                    <NavigationLink>Codes</NavigationLink>
                </NavigationLinkContainer>
                <NavigationLinkContainer to="/agents">
                    <FaListCheck />
                    <NavigationLink>Agents</NavigationLink>
                </NavigationLinkContainer>
                <NavigationLinkContainer to="/shippers">
                    <FaTruck />
                    <NavigationLink>Livreurs</NavigationLink>
                </NavigationLinkContainer>
                <NavigationButton onClick={handleLogout}>
                    <FaDoorOpen />
                    <p>Déconnexion</p>
                </NavigationButton>
            </NavigationBar>
            <div className="flex flex-col flex-1 justify-center items-center w-full max-w-7xl">
                <Outlet />
            </div>
            <Footer />
        </main>
    )
}

export default App
