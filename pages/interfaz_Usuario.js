import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import axios from 'axios';
import { useSession, signIn, signOut } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });
const backUrl = process.env.NEXT_PUBLIC_API_URL;

export default function InterfazUsuario() {
    const { data: session } = useSession();
    const [users, setUsers] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [nameUser, setNameUser] = useState('');
    const [emailUser, setEmailUser] = useState('');
    const [passwordUser, setPasswordUser] = useState('');
    const [manualEmailUser, setManualEmailUser] = useState('');
    const [manualPasswordUser, setManualPasswordUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);

    const generateRandomPassword = () => {
        return Math.random().toString(36).slice(-8); // Genera una contraseña aleatoria de 8 caracteres
    };

    useEffect(() => {
        async function fetchUsers() {
            try {
                const { data } = await axios.get(`${backUrl}/users`);
                setUsers(data);
            } catch (error) {
                console.log("Error cargando los usuarios", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    useEffect(() => {
        async function fetchCharacters() {
            try {
                const { data } = await axios.get(`${backUrl}/characters`);
                setCharacters(data);
            } catch (error) {
                console.log("Error cargando los personajes", error);
            }
        }
        fetchCharacters();
    }, []);
    
    useEffect(() => {
        if (session && session.user) {
            const newUser = {
                name_user: session.user.name,
                email_user: session.user.email,
                password_user: generateRandomPassword()
            };
            addUserToDatabase(newUser);
            setIsLoggedIn(true);
        }
    }, [session]);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const addUserToDatabase = async (user) => {
        try {
            // Verificar si el usuario ya existe
            const existingUser = users.find(u => u.email_user === user.email_user);
            if (existingUser) {
                console.log('El usuario ya existe en la base de datos.');
                return;
            }

            // Agregar usuario
            const response = await axios.post(`${backUrl}/users`, user);
            console.log('Usuario añadido correctamente:', response.data);
            setUsers([...users, response.data]);
            setIsLoggedIn(true);
            setLoggedInUser(response.data);
            localStorage.setItem('loggedInUser', JSON.stringify(response.data));
        } catch (error) {
            console.log('Error al añadir usuario:', error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        const user = {
            name_user: nameUser,
            email_user: emailUser,
            password_user: passwordUser,
        };
        await addUserToDatabase(user);
    };

    const handleLogin = async () => {
        try {
            await signIn('google', { callbackUrl: '/' });
        } catch (error) {
            console.log('Error al iniciar sesión:', error);
        }
    };

    const handleManualLogin = async (e) => {
        e.preventDefault();
        try {
            const user = users.find(u => u.email_user === manualEmailUser && u.password_user === manualPasswordUser);
            if (user) {
                setIsLoggedIn(true);
                setLoggedInUser(user);
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                console.log('Inicio de sesión exitoso:', user);
            } else {
                console.log('Correo o contraseña incorrectos.');
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

    if (loading) {
        return <p className='text-2xl font-bold text-center'>Cargando usuarios...</p>
    }

    return (
        <main className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`}>
            <img
                src="/Fondo_Biblioteca.jpeg"
                alt="landimg"
                layout="fill"
                className="object-cover w-full h-screen opacity-30 z-0 fixed"
            />
            <div className='z-10 bg-black bg-opacity-80 p-5'>
                {isLoggedIn ? (
                    <div>
                        <h1 className='text-3xl font-bold text-center'>Bienvenido, {loggedInUser ? loggedInUser.name_user : session.user.name}</h1>
                        <p>Email: {loggedInUser ? loggedInUser.email_user : session.user.email}</p>
                        <button onClick={handleLogout} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <div className="items-end justify-center w-full h-screen flex flex-col z-10">
                        <div className="container w-1/2 h-auto bg-white m-4 p-4 border-4 border-black rounded-xl">
                            <form onSubmit={handleAddUser} className='mt-6'>
                                <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nameUser'>
                                        Nombre de usuario
                                    </label>
                                    <input
                                        type='text'
                                        id='nameUser'
                                        value={nameUser}
                                        onChange={(e) => setNameUser(e.target.value)}
                                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    />
                                </div>
                                <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='emailUser'>
                                        Correo
                                    </label>
                                    <input
                                        type='email'
                                        id='emailUser'
                                        value={emailUser}
                                        onChange={(e) => setEmailUser(e.target.value)}
                                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    />
                                </div>
                                <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='passwordUser'>
                                        Contraseña
                                    </label>
                                    <input
                                        type='password'
                                        id='passwordUser'
                                        value={passwordUser}
                                        onChange={(e) => setPasswordUser(e.target.value)}
                                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    />
                                </div>
                                <div className='flex items-center justify-between'>
                                    <button
                                        type='submit'
                                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                                    >
                                        Añadir usuario
                                    </button>
                                </div>
                            </form>

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
                                <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='iniciarPasswordUser'>
                                        Contraseña
                                    </label>
                                    <input
                                        type='password'
                                        id='iniciarPasswordUser'
                                        value={manualPasswordUser}
                                        onChange={(e) => setManualPasswordUser(e.target.value)}
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
                            <button onClick={handleLogin} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                                Iniciar sesión con Google
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}

