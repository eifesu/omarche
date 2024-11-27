import clsx from "clsx";

export const TableContainer = ({ children, className }: { children: React.ReactNode, className?: string }): JSX.Element => {
    return <table className={clsx("w-full text-left", className)}>
        {children}
    </table>
}

export const TableRow = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: (e: React.MouseEvent<HTMLTableRowElement>) => void }): JSX.Element => {
    return <tr className={clsx("border-b transition-all duration-200 border-slate-100 hover:bg-slate-50", className)} onClick={onClick}>
        {children}
    </tr>
}

export const TableCell = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void }): JSX.Element => {
    return <td className={clsx("px-8 py-2 text-sm select-none", className)} onClick={onClick}>
        {children}
    </td>
}

export const TableHeader = ({ children, className }: { children: React.ReactNode, className?: string }): JSX.Element => {
    return <th className={clsx("px-8 py-2 text-xs font-medium tracking-widest text-slate-400", className)}>
        {children}
    </th>
}
