import Link from 'next/link';
import Header from '@/components/common/Header';
import StartAnimation from '@/components/common/StartAnimation'
import CharacterGrid from '@/components/common/CharacterGrid';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Jersey_10 } from '@next/font/google';
import { PiArrowSquareRight } from "react-icons/pi";

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

    useEffect(() => {
        if (session && session.user) {
            const newUser = {
                name_user: session.user.name,
                email_user: session.user.email,
            };
            addUserToDatabase(newUser);
            setIsLoggedIn(true);
        }
    }, [session]);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setLoggedInUser(user);
            setIsLoggedIn(true);
        }
    }, []);

    const addUserToDatabase = async (user) => {
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
    };

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
                <StartAnimation/>
                <img
                    src="/Fondo_Biblioteca.jpeg"
                    alt="landimg"
                    layout="fill"
                    className="object-cover w-full h-screen opacity-30 z-0 fixed"
                />
                <div className='z-10 w-full h-screen overflow-y-auto flex flex-col items-center justify-start p-4 gap-4'>
                    <div className='w-10/12 h-auto'>
                        <Header />
                    </div>
                    <div className="container w-1/2 h-auto bg-white m-4 p-4 border-4 border-black rounded-xl">
                        <form onSubmit={handleManualLogin} className='mt-6'>
                            <div className='mb-4'>
                                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='IniciarEmailUser'>
                                    Correo
                                </label>
                                <input
                                    type='email'
                                    id='IniciarEmailUser'
                                    value={manualEmailUser}
                                    onChange={(e) => setManualEmailUser(e.target.value)}
                                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <button
                                    type='submit'
                                    className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                                >
                                    Iniciar sesión
                                </button>
                            </div>
                        </form>
                        <p>No estás logeado</p>
                        <button onClick={() => signIn('google', { callbackUrl: '/' })} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                            Iniciar sesión con Google
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={`flex min-h-screen flex-col items-center justify-between ${jersey_10.className}`}>
            <StartAnimation/>
            <img
                src="/Fondo_Biblioteca.jpeg"
                alt="landimg"
                layout="fill"
                className="object-cover w-full h-screen opacity-30 z-0 fixed"
            />
            <div className='z-10 w-full h-screen overflow-y-auto flex flex-col items-center justify-start p-4 gap-4'>
                <div className='w-10/12 h-auto'>
                    <Header />
                </div>
                <div className='container w-10/12 gap-4 flex flex-col items-center justify-start'>
                    <div className='w-full h-auto flex items-center justify-start rounded-xl bg-black bg-opacity-60 p-6 gap-6
                    border-white border-2'>
                        <img
                            src="/Imagen_Perfil.png"
                            alt="imagen de perfil"
                            layout="fill"
                            className="w-44 rounded-full"
                        />
                        <div>
                            <h1 className='text-6xl text-white'>
                                Bienvenido, {loggedInUser ? loggedInUser.name_user : session.user.name}
                            </h1>
                            <p className='text-3xl text-white'>Email: {loggedInUser ? loggedInUser.email_user : session.user.email}</p>
                        </div>
                        <button onClick={handleLogout}
                            className='w-44 bg-red-500 hover:bg-red-700 text-white text-3xl py-2 px-1 rounded focus:outline-none 
                            focus:shadow-outline ml-auto m-2 gap-1 transition-all ease-out duration-500'
                        >
                            Cerrar sesión
                            <div className='flex items-center justify-center scale-150'>
                                <PiArrowSquareRight />
                            </div>
                        </button>
                    </div>
                    <div className='w-full h-auto flex-col items-center justify-start rounded-xl bg-black bg-opacity-60 p-6 gap-6
                    border-white border-2'>

                        <div className='flex flex-col items-center justify-center'>
                            <CharacterGrid userId={loggedInUser?.id_user} />
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}

