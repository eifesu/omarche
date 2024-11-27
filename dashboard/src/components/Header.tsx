
import clsx from "clsx";

export const HeaderContainer = ({ children, className }: { children: React.ReactNode, className?: string }): JSX.Element => {
    return <div className={clsx("flex flex-row p-8 justify-between items-end w-full border-b border-slate-100", className)}>
        {children}
    </div>
}

export const HeaderTitle = ({ children, className }: { children: React.ReactNode, className?: string }): JSX.Element => {
    return <h1 className={clsx("text-lg font-medium", className)}>{children}</h1>
}

export const HeaderSubtitle = ({ children, className }: { children: React.ReactNode, className?: string }): JSX.Element => {
    return <h2 className={clsx("text-sm font-normal text-slate-500", className)}>{children}</h2>
}
