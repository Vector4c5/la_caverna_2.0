import { IoHomeOutline } from "react-icons/io5";
import { MdPlayArrow } from "react-icons/md";
import { GiAxeSword } from "react-icons/gi";
import { GiOpenBook } from "react-icons/gi";
import { FaUserFriends } from "react-icons/fa";
import Link from "next/link";
import { Jersey_10 } from '@next/font/google';
import LoginBtn from "@/components/common/Login-Btn";

const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });

export default function Header() {
    
    const navPages = [
        {
            name: "Home",
            href: "/landing",
            icon: <IoHomeOutline />
        },
        {
            name: "Multiplayer",
            href: "/services",
            icon: <FaUserFriends/>
        },
        {
            name: "Playes",
            href: "/about",
            icon: <GiAxeSword />
        },
        {
            name: "Masters",
            href: "/contact",
            icon: <GiOpenBook />
        },
    ];

    return (
        <main className={`flex items-center w-full h-full py-3 max-h-24 border-double border-8 border-purple-400 bg-black bg-opacity-50 ${jersey_10.className}
        shadow-lg shadow-gray-500`}>
            <div className="flex justify-start w-1/2 mx-8">
                <h1 className="text-6xl text-white">
                    The Cavern
                </h1>
            </div>
            <div className="flex justify-end w-1/2 mx-8">
                <nav className="flex justify-around gap-5">
                    {navPages.map((page) => (
                        <li key={page.href} className="group flex text-center items-center relative">
                            <Link href={page.href} className="flex items-center gap-4 mx-2 group-hover:translate-x-4 transition 
                            duration-300 ease-in-out">
                                <div className="opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out scale-150">
                                    <MdPlayArrow />
                                </div>
                                <div className="scale-150">
                                    {page.icon}
                                </div>
                                <p className="text-3xl">
                                    {page.name}
                                </p>
                            </Link>
                        </li>
                    ))}
                </nav>
                <LoginBtn />
            </div>
        </main>
    );
}