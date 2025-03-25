import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Jersey_10 } from '@next/font/google';
import { FaUserAstronaut } from "react-icons/fa";
import { MdPlayArrow } from "react-icons/md";
import { useEffect, useState } from 'react';
import axios from 'axios';

const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });
const backUrl = process.env.NEXT_PUBLIC_API_URL;

export default function LoginBtn() {
    const { data: session } = useSession();
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = localStorage.getItem('loggedInUser');
            if (storedUser) {
                setLoggedInUser(JSON.parse(storedUser));
            } else if (session && session.user) {
                try {
                    const { data } = await axios.get(`${backUrl}/users`, {
                        params: { email: session.user.email }
                    });
                    setLoggedInUser(data);
                    localStorage.setItem('loggedInUser', JSON.stringify(data));
                } catch (error) {
                    console.error('Error fetching user from database:', error);
                }
            }
        };
        fetchUser();
    }, [session]);

    if (loggedInUser) {
        return (
            <Link href='/interfaz_Usuario' className={`group flex items-center gap-4 mx-2 hover:translate-x-4 transition 
                            duration-300 ease-in-out ${jersey_10.className}`}>
                <div className="opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out scale-150">
                    <MdPlayArrow />
                </div>
                <div className="scale-150">
                    <FaUserAstronaut />
                </div>
                <p className="text-3xl">
                    {loggedInUser.name_user}
                </p>
            </Link>
        );
    }

    return (
        <>
            <Link href='/' className={`group flex items-center gap-4 mx-2 hover:translate-x-4 transition 
                            duration-300 ease-in-out ${jersey_10.className}`}>
                <div className="opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out scale-150">
                    <MdPlayArrow />
                </div>
                <div className="scale-150">
                    <FaUserAstronaut />
                </div>
                <p className="text-3xl">
                    Inicia sesion
                </p>
            </Link>
        </>
    );
}