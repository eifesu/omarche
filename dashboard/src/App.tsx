import { Outlet } from 'react-router-dom';
import './App.css'
import NavigationBar, { NavigationButton, NavigationLink, NavigationLinkContainer, NavigationLogo } from './components/Navigation'
import { FaCreditCard, FaDoorOpen, FaReceipt, FaShop, FaTags } from "react-icons/fa6";
import { Toaster } from 'sonner';

function App() {
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
                <NavigationLinkContainer to="/cards">
                    <FaCreditCard />
                    <NavigationLink>Cartes</NavigationLink>
                </NavigationLinkContainer>
                <NavigationLinkContainer to="/promo-codes">
                    <FaTags />
                    <NavigationLink>Codes</NavigationLink>
                </NavigationLinkContainer>
                <NavigationButton>
                    <FaDoorOpen />
                    <p>Déconnexion</p>
                </NavigationButton>
            </NavigationBar>
            <div className="flex flex-col flex-1 justify-center items-center w-full max-w-7xl">
                <Outlet />
            </div>
        </main>
    )
}

export default App
