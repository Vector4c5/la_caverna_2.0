import Link from 'next/link';
import Header from '@/components/common/Header';
import StartAnimation from '@/components/common/StartAnimation'
import CharacterGrid from '@/components/common/CharacterGrid';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Jersey_10 } from '@next/font/google';
import { PiArrowSquareRight } from "react-icons/pi";
import Image from 'next/image';

const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });
const backUrl = process.env.NEXT_PUBLIC_API_URL;

export default function InterfazUsuario() {
    const { data: session } = useSession();
    const [users, setUsers] = useState([]);
    const [manualEmailUser, setManualEmailUser] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const { data } = await axios.get(`${backUrl}/users_cavern`);
                setUsers(data);
            } catch (error) {
                console.log("Error cargando los usuarios", error);
            }
        }
        fetchUsers();
    }, []);

    const addUserToDatabase = useCallback(async (user) => {
        try {
            const existingUser = users.find(u => u.email_user === user.email_user);
            if (existingUser) {
                console.log('El usuario ya existe en la base de datos.');
                return;
            }

            const response = await axios.post(`${backUrl}/users_cavern`, user);
            console.log('Usuario añadido correctamente:', response.data);

            setUsers([...users, response.data]);
            setLoggedInUser(response.data);
            localStorage.setItem('loggedInUser', JSON.stringify(response.data));
        } catch (error) {
            console.log('Error al añadir usuario:', error);
        }
    }, [users]);

    useEffect(() => {
        if (session && session.user) {
            const newUser = {
                name_user: session.user.name,
                email_user: session.user.email,
            };
            addUserToDatabase(newUser);
            setIsLoggedIn(true);
        }
    }, [session, addUserToDatabase]);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setLoggedInUser(user);
            setIsLoggedIn(true);
        }
    }, []);

    const handleManualLogin = async (e) => {
        e.preventDefault();
        try {
            const user = users.find(u => u.email_user === manualEmailUser);
            if (user) {
                setIsLoggedIn(true);
                setLoggedInUser(user);
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                console.log('Inicio de sesión exitoso:', user);
            } else {
                console.log('Correo incorrecto.');
            }
        } catch (error) {
            console.log('Error al iniciar sesión manualmente:', error);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setLoggedInUser(null);
        localStorage.removeItem('loggedInUser');
        signOut();
    };

    if (!isLoggedIn) {
        return (
            <main className={`flex min-h-screen flex-col items-center justify-between ${jersey_10.className}`}>
                <StartAnimation />
                <div className="fixed inset-0 z-0 w-full h-full">
                    <img
                        src="/Fondo_Biblioteca.jpeg"
                        alt="background library"
                        className="w-full h-full object-cover opacity-30"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                </div>
                <div className="z-10 w-full h-screen overflow-y-auto flex flex-col items-center justify-start p-4 gap-4">
                    <div className="w-11/12 sm:w-10/12">
                        <Header />
                    </div>
                    <div
                        className="relative bg-cover w-full sm:w-2/3 h-64 sm:h-80 md:h-full m-4 border-2 border-white rounded-xl overflow-hidden shadow-lg"
                        style={{
                            backgroundImage: "url('/Risco.jpeg')",
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
                        <h2 className="absolute text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-right right-4 sm:right-8 md:right-16 lg:right-32 top-4 sm:top-6 z-20 font-bold drop-shadow-lg">
                            Adventure awaits!
                        </h2>
                        <Link
                            href="/"
                            className="group absolute w-10/12 sm:w-8/12 lg:w-6/12 h-auto p-2 border-4 border-double border-yellow-700 rounded-xl bg-black bg-opacity-80 hover:scale-90
                            transform transition duration-500 ease-in-out overflow-hidden animate-pulse hover:animate-none z-20 left-0 right-0 bottom-4 mx-auto"
                        >
                            <span
                                className="relative z-10 w-full h-full text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white text-center
                                group-hover:text-black flex items-center justify-center transition duration-500 ease-in-out py-1 sm:py-2">
                                Log in here
                            </span>
                            <span className="absolute top-0 left-0 w-full h-full bg-yellow-400 bg-opacity-60 
                            transform translate-y-full group-hover:translate-y-0 transition duration-500 ease-in-out">
                            </span>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={`flex min-h-screen flex-col items-center justify-between ${jersey_10.className}`}>
            <StartAnimation />
            <div className="fixed inset-0 z-0 w-full h-full">
                <img
                    src="/Fondo_Biblioteca.jpeg"
                    alt="background library"
                    className="w-full h-full object-cover opacity-30"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                />
            </div>
            <div className="z-10 w-full h-screen overflow-y-auto flex flex-col items-center justify-start p-4 gap-4">
                <div className="w-11/12 sm:w-10/12 h-auto">
                    <Header />
                </div>
                <div className="container w-full sm:w-10/12 gap-4 flex flex-col items-center justify-start">
                    <div className="w-full h-auto flex flex-col sm:flex-row items-center sm:items-center justify-start rounded-xl bg-black bg-opacity-60 p-4 sm:p-6 gap-4 sm:gap-6
                    border-white border-2">
                        <div className="relative w-32 h-32 sm:w-44 sm:h-44">
                            <img
                                src="/Logo_Jugador.jpeg"
                                alt="imagen de perfil"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full"
                            />
                        </div>
                        <div className="text-center flex flex-col justify-center sm:text-left">
                            <h1 className="text-4xl sm:text-6xl text-white">
                                Welcome, {loggedInUser ? loggedInUser.user_name || loggedInUser.name_user : session.user.name}
                            </h1>
                            <p className="text-2xl sm:text-3xl text-white">
                                Email: {loggedInUser ? loggedInUser.email_user : session.user.email}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full sm:w-44 bg-red-500 hover:bg-red-700 text-white text-2xl sm:text-3xl py-2 px-1 rounded focus:outline-none 
                            focus:shadow-outline ml-auto m-2 gap-1 transition-all ease-out duration-500"
                        >
                            Sign out
                            <div className="flex items-center justify-center scale-150">
                                <PiArrowSquareRight />
                            </div>
                        </button>
                    </div>
                    <div className="w-full h-auto flex flex-col items-center justify-start rounded-xl bg-black bg-opacity-60 p-4 gap-4 sm:gap-6
                    border-white border-2">
                        <div className="flex flex-col items-center justify-center w-full h-auto">
                            <CharacterGrid userId={loggedInUser?.id_user} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

