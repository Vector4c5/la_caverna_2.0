import { useSession, signIn, signOut } from 'next-auth/react';
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
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = localStorage.getItem('loggedInUser');
            if (storedUser) {
                setLoggedInUser(JSON.parse(storedUser));
            } else if (session && session.user) {
                try {
                    const { data } = await axios.get(`${backUrl}/users_cavern`, {
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

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        // Eliminar el usuario almacenado en localStorage
        localStorage.removeItem('loggedInUser');
        // Actualizar el estado para reflejar que no hay usuario logueado
        setLoggedInUser(null);
        // Llamar a la función de cierre de sesión de NextAuth
        signOut();
    };

    if (loggedInUser) {
        return (
            <div className={`relative ${jersey_10.className}`}>
                <button onClick={toggleMenu} className="group max-w-60 flex items-center gap-4 mx-2 hover:translate-x-4 transition overflow-hidden
                            duration-300 ease-in-out">
                    <div className="opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out scale-150">
                        <MdPlayArrow />
                    </div>
                    <div className="scale-150">
                        <FaUserAstronaut />
                    </div>
                    <p className="text-3xl truncate overflow-hidden whitespace-nowrap text-ellipsis">
                        {loggedInUser.name_user}
                    </p>
                </button>
                {menuOpen && (
                    <div className="absolute mr-auto mt-8 w-48 bg-white border-2 border-gray-500 shadow-lg z-10">
                        <Link href="/interfaz_Usuario" className="group flex items-center px-2 py-2 text-2xl text-black border-b-2 border-black hover:bg-gray-200">
                            <div className="opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out">
                                <MdPlayArrow />
                            </div>
                            <p className='group-hover:translate-x-2 transition duration-300 ease-in-out'>
                                Perfil
                            </p>
                        </Link>

                        <Link href="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                            Configuración
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`relative ${jersey_10.className}`}>
            <button onClick={toggleMenu} className="group flex items-center gap-4 mx-2 hover:translate-x-4 transition 
                            duration-300 ease-in-out">
                <div className="opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out scale-150">
                    <MdPlayArrow />
                </div>
                <div className="scale-150">
                    <FaUserAstronaut />
                </div>
                <p className="text-3xl">
                    Inicia sesión
                </p>
            </button>
            {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button onClick={() => signIn()} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Iniciar sesión con Google</button>
                </div>
            )}
        </div>
    );
}