import { Link } from 'react-router-dom';

const Footer = (): JSX.Element => {
    return (
        <footer className='flex justify-center items-center px-8 w-full h-14 border-t bg-slate-50 border-slate-200'>
            <div className='flex gap-8 justify-center items-center w-full max-w-7xl'>
                <FooterLink to="https://app.omarcheivoire.ci/public/PRESENTATION-OMARCHE.pdf">
                    Notre entreprise
                </FooterLink>
                <FooterLink to="https://app.omarcheivoire.ci/public/NUMERO-DE-TABLES.pdf">
                    Pour les épiceries
                </FooterLink>
            </div>
        </footer>
    );
}

interface FooterLinkProps {
    children: React.ReactNode;
    to: string;
}

const FooterLink = ({ children, to }: FooterLinkProps): JSX.Element => {
    return (
        <Link 
            target="_blank"
            to={to}
            className='text-sm transition-colors duration-300 text-slate-600 hover:text-slate-900'
        >
            {children}
        </Link>
    );
}

export default Footer;
