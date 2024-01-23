"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

import useUploadModal from "@/hooks/useUploadModal";
import useSubscribeModal from "@/hooks/useSubscribeModal";

import Button from "./Button"
import useAuthModal from "@/hooks/useAuthModal";
import usePlayer from "@/hooks/usePlayer";
import HeaderItem from "./HeaderItem";

interface HeaderProps {
    children: React.ReactNode;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({
    children,
    className
}) => {
    const player = usePlayer();
    const authModal = useAuthModal();
    const router = useRouter();

    const supabaseClient = useSupabaseClient();
    const { user, subscription } = useUser();

    const pathname = usePathname();
    const routes = useMemo(() => [
        {
            icon: HiHome,
            label: 'Home',
            active: pathname !== '/search',
            href: '/',
        },
        {
            icon: BiSearch,
            label: 'Search',
            active: pathname == '/search',
            href: '/search',
        }
    ], [pathname]);

    const uploadModal = useUploadModal();
    const subscribeModal = useSubscribeModal();
    const onClick = () => {
        if (!user){
            return authModal.onOpen();
        }

        if (!subscription) {
            return subscribeModal.onOpen();
        }

        return uploadModal.onOpen();
    };


    const handleLogout = async() =>{
        const { error } = await supabaseClient.auth.signOut();
        player.reset();
        router. refresh();
        
        if (error) {
            toast.error(error.message);
        } else{
            toast.success('Logged out!')
        }
    };

    return ( 
        <div
            className={twMerge(`
                h-fit
                bg-gradient-to-b
                from-emerald-800
                p-6
            `,
                className
            )}
        >
            <div className="
                w-full
                mb-4
                flex
                items-center
                justify-between
            ">
                <div className="
                    hidden
                    md:flex
                    gap-x-2
                    items-center
                ">
                    <button
                        onClick={()=> router.back()}
                        className="
                            rounded-full
                            bg-black
                            flex
                            items-center
                            justify-center
                            hover:opacity-75
                            transition
                        "
                    >
                        <RxCaretLeft size={35} className="text-white"/>
                    </button>
                    <button
                        onClick={()=> router.forward()}
                        className="
                            rounded-full
                            bg-black
                            flex
                            items-center
                            justify-center
                            hover:opacity-75
                            transition
                        "
                    >
                        <RxCaretRight size={35} className="text-white"/>
                    </button>
                </div>
                <div className="flex md:hidden gap-x-2 items-center">
                        <button
                            className="
                                flex
                                flex-row
                                gap-x-2
                                py-4
                            "
                        >
                            {routes.map((item) => (
                                <HeaderItem
                                    key={item.label}
                                    {...item}
                                />
                            ))}
                        </button>
                        <AiOutlinePlus 
                            onClick={onClick}
                            size={36}
                            className="
                                rounded-full
                                p-2
                                bg-white
                                flex
                                items-center
                                justify-center
                                hover:opacity-75
                                text-black
                                cursor-pointer
                                transition
                            "
                        />

                    {/* <button
                        className="
                            rounded-full
                            p-2
                            bg-white
                            flex
                            items-center
                            justify-center
                            hover:opacity-75
                            transition
                        "  
                    >
                        <HiHome size={20} className="text-black"/>
                    </button>
                    <button
                        className="
                            rounded-full
                            p-2
                            bg-white
                            flex
                            items-center
                            justify-center
                            hover:opacity-75
                            transition
                        "  
                    >
                        <BiSearch size={20} className="text-black"/>
                    </button> */}
                </div>
                <div
                    className="
                        flex
                        justity-between
                        items-center
                        gap-x-4
                    "
                >
                    {user ? (
                        <div className="flex gap-x-4 items-center">
                            <Button
                                onClick={handleLogout}
                                className="bg-white px-6 py-2"
                            >
                                Logout
                            </Button>
                            <Button
                                onClick={()=>router.push('/account')}
                                className="bg-white"
                            >
                                <FaUserAlt />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div>
                                <Button
                                    onClick={authModal.onOpen}
                                    className="
                                        bg-transparent
                                        text-neutral-300
                                        font-medium
                                    "
                                >
                                    Sign Up
                                </Button>
                            </div>
                            <div>
                                <Button
                                    onClick={authModal.onOpen}
                                    className="
                                        bg-white
                                        px-6
                                        py-2
                                    "
                                >
                                    Log in
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {children}
        </div>
     );
}
 
export default Header;