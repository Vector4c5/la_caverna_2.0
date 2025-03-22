import { IoHomeOutline} from "react-icons/io5";
import { MdPlayArrow } from "react-icons/md";
import Link from "next/link";

export default function Header() {
    
    const navPages = [
        {
            name: "home",
            href: "/index.js",
            icon: <IoHomeOutline />
        },
        {
            name: "about",
            href: "/about.js",
            icon: <IoHomeOutline />
        },
        {
            name: "contact",
            href: "/contact.js",
            icon: <IoHomeOutline />
        },
    ];

    return (
        <div className="flex items-center w-full h-full border-double border-4 border-purple-400 bg-gray-900 bg-opacity-50">
            <div className="flex justify-start w-1/2 mx-8">
                <h1 className="text-4xl font-['Press_Start_2P'] text-white">
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
                                <p className="text-xl">
                                    {page.name}
                                </p>
                            </Link>
                        </li>
                    ))}
                </nav>
            </div>
        </div>
    );
}