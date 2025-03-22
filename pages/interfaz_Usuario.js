import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import axios from 'axios';

import Header from '@/components/common/Header';

const inter = Inter({ subsets: ['latin'] });
const backUrl = process.env.NEXT_PUBLIC_API_URL;

export default function interfaz_Usuario() {

    const [users, setUsers] = useState([]);
    const [characters, setCharacters] = useState([]);
    
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <p
            className='text-2xl font-bold text-center'>
            Cargando usuarios...
        </p>
    }

    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`}>
            <img
                src="/Fondo_Biblioteca.jpeg"
                alt="landimg"
                layout="fill"
                className=" object-cover w-full h-screen opacity-30 z-0 fixed"
            />

            <div className='maw-w-lg mx-auto p-6 text-black bg-white shadow-md rounded-lg z-10'>


                <h1 className='text-3xl font-bold text-center'>
                    Usuarios
                </h1>
                <ul className='divide-y divide-gray-300'>
                    {users.map((user) => (
                        <li key={user.id_user} className='p-3'>
                            <span className='font-semibold'>{user.name_user}</span>-{" "}
                            {user.email_user}
                            <span className='font-semibold'>{user.name_user}</span>-{" "}
                            {user.password_user}
                        </li>
                    ))}
                </ul>
                <h1 className='text-3xl font-bold text-center mt-6'>
                    Personajes
                </h1>
                <ul className='divide-y divide-gray-300'>
                    {characters.map((character) => (
                        <li key={character.id_character} className='p-3'>
                            <span className='font-semibold'>{character.name_character}</span>-{" "}
                            {character.description_character}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    )
}

