import Link from 'next/link'
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface HeaderItemProps {
    icon: IconType;
    label: string;
    active?: boolean;
    href: string;
}

const HeaderItem: React.FC<HeaderItemProps> = ({
    icon: Icon,
    label,
    active,
    href
}) =>{
    return(
        <Link
            href={href}
            className={twMerge(`
                rounded-full
                p-2
                bg-white
                flex
                items-center
                justify-center
                hover:opacity-75
                transition
            `,
                active&& "text-black"
            )}
        >
            <Icon size={20} className="text-black"/>
            {/* <p className="truncat w-full">{label}</p> */}
        </Link>
    );
}

export default HeaderItem