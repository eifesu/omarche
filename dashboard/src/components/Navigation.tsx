import logo from '@/assets/logo.png';
import { ButtonHTMLAttributes } from 'react';
import { LinkProps, NavLink } from 'react-router-dom';

const NavigationBar = ({ children }: { children: React.ReactNode }): JSX.Element => {
    return <nav className='bg-slate-50 border-b border-slate-200 h-14 w-full flex items-center justify-center px-8'>
        <div className='flex items-center justify-center w-full max-w-7xl gap-2'>
            {children}
        </div>
    </nav>
}


export const NavigationLogo = (): JSX.Element => {
    return <NavLink to="/" className='flex items-center justify-center mr-8'>
        <img src={logo} alt="logo" className='w-8 h-8' />
    </NavLink>
}

export const NavigationLink = ({ children }: { children: React.ReactNode }): JSX.Element => {
    return <p className='rounded-md transition-all duration-300 font-medium'>{children}</p>
}


interface NavigationLinkContainerProps extends LinkProps {
    children: React.ReactNode;
}

export const NavigationLinkContainer = (props: NavigationLinkContainerProps): JSX.Element => {
    return <NavLink {...props} className={({ isActive }) => 'group hover:bg-slate-200 bg-slate-50 transition-all duration-300 flex items-center justify-center gap-3 px-4 py-2 rounded-md ' + (isActive ? ' text-slate-800 bg-slate-200' : ' text-slate-400')}>
        {props.children}
    </NavLink>
}

interface NavigationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const NavigationButton = (props: NavigationButtonProps): JSX.Element => {
    return <button {...props} className='ml-auto group hover:bg-slate-100 bg-white transition-all duration-300 font-medium flex items-center justify-center gap-3 px-4 py-2 rounded-md text-slate-700 border border-slate-300'>
        {props.children}
    </button>
}

export default NavigationBar;
