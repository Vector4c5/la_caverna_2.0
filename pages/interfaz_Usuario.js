import Link from 'next/link';
import Header from '@/components/common/Header';
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
        const fetchCharacters = async (userId) => {
            try {
                const { data } = await axios.get(`${backUrl}/characters`, {
                    params: { userId }
                });
                setCharacters(data);
            } catch (error) {
                console.log("Error cargando los personajes", error);
            }
        };

        if (loggedInUser) {
            fetchCharacters(loggedInUser.id_user);
        }
    }, [loggedInUser]);

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
            const user = JSON.parse(storedUser);
            setLoggedInUser(user);
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
        <main className={`flex min-h-screen flex-col items-center justify-between ${jersey_10.className}`}>
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
                {isLoggedIn ? (
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
                                Bienvenido, {loggedInUser ? loggedInUser.name_user : session.user.name}</h1>
                            <p className='text-3xl text-white'>Email: {loggedInUser ? loggedInUser.email_user : session.user.email}</p>
                            </div>
                            <button onClick={handleLogout} 
                            className='bg-red-500 hover:bg-red-700 text-white text-3xl py-2 px-4 rounded focus:outline-none 
                            focus:shadow-outline ml-auto m-4 gap-1 transition-all ease-out duration-500'>
                                Cerrar sesión
                                <div className='flex items-center justify-center scale-150'>
                                    <PiArrowSquareRight/>
                                </div>
                                
                            </button>
                        </div>
                        <div className='w-full h-auto grid grid-cols-3 gap-4 rounded-xl bg-black bg-opacity-60 p-6
                        border-white border-2'>
                            <h2 className='col-span-3 text-7xl text-center'>
                                Tus personajes
                            </h2>
                            <Link href='/Creacion_Personajes' 
                            className='col-span-3 text-center text-4xl bg-blue-500 hover:bg-blue-700 transition-all ease-out duration-500 '> 
                                Crear Personaje
                            </Link>

                            <ul className='col-span-3 grid grid-cols-3 gap-4'>
                                {characters.map(character => (
                                    <li key={character.id_character} className='text-white text-3xl'>
                                        {
                                            character.name_character
                                        }<br/>
                                        {
                                            character.race
                                        }<br/>
                                        {
                                            character.level_character
                                        }<br/>
                                        {
                                            character.class
                                        }<br/>
                                        {
                                            character.dexterity
                                        }<br/>
                                        {
                                            character.constitution
                                        }<br/>
                                        {
                                            character.intelligence
                                        }<br/>
                                        {
                                            character.wisdom
                                        }<br/>
                                        {
                                            character.charisma
                                        }<br/>
                                        {
                                            character.hit_points
                                        }<br/>
                                        {
                                            character.armor_class
                                        }
                                        {
                                            character.initiative
                                        }<br/>
                                        {
                                            character.speed
                                        }<br/>
                                        {
                                            character.background
                                        }<br/>
                                        <div>
                                            <h3 className='text-2xl'>Skills:</h3>
                                            <ul>
                                                {Object.entries(character.skills).map(([skill, value]) => (
                                                    <li key={skill}>
                                                        {skill}: {value}<br/>
                                                        </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className='text-2xl'>Spells:</h3>
                                            <ul>
                                                {Object.entries(character.spells).map(([spell, value]) => (
                                                    <li key={spell}>
                                                        {spell}: {value}<br/>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="items-end justify-center w-full h-screen flex flex-col z-10">
                        <div className="container w-1/2 h-auto bg-white m-4 p-4 border-4 border-black rounded-xl">
                        <Link href='/Creacion_Personajes' 
                            className='col-span-3 text-center text-4xl bg-blue-500 hover:bg-blue-700 transition-all ease-out duration-500 '> 
                                Crear Personaje
                            </Link>
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

