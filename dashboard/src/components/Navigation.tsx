import logo from '@/assets/logo.png';
import { ButtonHTMLAttributes } from 'react';
import { LinkProps, NavLink } from 'react-router-dom';

const NavigationBar = ({ children }: { children: React.ReactNode }): JSX.Element => {
    return <nav className='flex justify-center items-center px-8 w-full h-14 border-b bg-slate-50 border-slate-200'>
        <div className='flex gap-2 justify-center items-center w-full max-w-7xl'>
            {children}
        </div>
    </nav>
}


export const NavigationLogo = (): JSX.Element => {
    return <NavLink to="/" className='flex justify-center items-center mr-8'>
        <img src={logo} alt="logo" className='w-8 h-8' />
    </NavLink>
}

export const NavigationLink = ({ children }: { children: React.ReactNode }): JSX.Element => {
    return <p className='font-medium rounded-md transition-all duration-300'>{children}</p>
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
    return <button {...props} className='flex gap-3 justify-center items-center px-4 py-2 ml-auto font-medium bg-white rounded-md border transition-all duration-300 group hover:bg-slate-100 text-slate-700 border-slate-300'>
        {props.children}
    </button>
}

export default NavigationBar;
