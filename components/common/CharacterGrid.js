import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlusSquare } from "react-icons/fa";

const backUrl = process.env.NEXT_PUBLIC_API_URL;

const CharacterGrid = ({ userId }) => {
    const [characters, setCharacters] = useState([]); // Estado para almacenar los personajes
    const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        async function fetchCharacters() {
            try {
                setLoading(true);
                setError(null);

                console.log(`Fetching characters for userId: ${userId}`);
                const { data } = await axios.get(`${backUrl}/characters/${userId}`);
                console.log('API Response:', data);

                // Verificamos si la respuesta es un array (como debería ser)
                if (Array.isArray(data)) {
                    setCharacters(data);
                } else if (data && typeof data === 'object') {
                    // Si es un objeto único, lo convertimos a array (por compatibilidad)
                    setCharacters([data]);
                } else {
                    console.log('No se encontraron personajes');
                    setCharacters([]);
                }
            } catch (error) {
                console.error('Error al obtener los personajes:', error);
                setError('No se pudieron cargar los personajes');
                setCharacters([]);
            } finally {
                setLoading(false);
            }
        }

        if (userId) {
            fetchCharacters();
        } else {
            setLoading(false);
            setCharacters([]);
        }
    }, [userId]);

    // Función para obtener la ruta de la imagen según la clase del personaje
    const getClassImage = (classCharacter) => {
        switch (classCharacter?.toLowerCase()) {
            case 'barbarian':
                return '/Logo_The_Cavern.jpeg'; // Ruta de la imagen para "Hechicera"
            case 'bard':
                return '/guerrero.png'; // Ruta de la imagen para "Guerrero"
            case 'cleric':
                return '/mago.png'; // Ruta de la imagen para "Mago"
            case 'druid':
                return '/arquero.png'; // Ruta de la imagen para "Arquero"
            case 'fighter':
                return '/arquero.png'; // Ruta de la imagen para "Arquero"
            case 'druid':
                return '/arquero.png'; // Ruta de la imagen para "Arquero"
            case 'monk':
                return '/arquero.png'; // Ruta de la imagen para "Arquero"
            case 'paladin':
                return '/arquero.png'; // Ruta de la imagen para "Arquero"
            case 'ranger':
                return '/arquero.png'; // Ruta de la imagen para "Arquero"
            case 'rogue':
                return '/arquero.png'; // Ruta de la imagen para "Arquero"
            case 'sorcerer':
                return '/arquero.png'; // Ruta de la imagen para "Arquero"
            case 'warlock':
                return '/arquero.png'; // Ruta de la imagen para "Arquero"
            case 'wizard':
                return '/arquero.png'; // Ruta de la imagen para "Arquero"
            default:
                return '/default.png'; // Imagen por defecto si no coincide ninguna clase
        }
    };


    if (loading) {
        return (
            <div className="w-full flex flex-col items-center justify-start gap-4">
                <h2 className='text-6xl w-10/12 text-white text-center border-b-2 border-white mb-4'>
                    Your Characters
                </h2>
                <Link
                    href='/add_Character'
                    className="group flex flex-col justify-center items-center w-8/12 border-4 border-pink-600 rounded-lg p-2 px-3 
                            text-white bg-black bg-opacity-60 hover:bg-pink-950 hover:scale-105 transition-all ease-out 
                            duration-400"
                >
                    <p className='group-hover:text-black text-center text-5xl'>Add Character</p>
                    <div className="group-hover:text-black w-full h-auto flex flex-col items-center justify-center text-4xl text-white">
                        <FaPlusSquare />
                    </div>
                </Link>
                <p className="text-center text-gray-500">Cargando personajes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full flex flex-col items-center justify-start gap-4">
                <h2 className='text-6xl w-10/12 text-white text-center border-b-2 border-white mb-4'>
                    Your Characters
                </h2>
                <Link
                    href='/add_Character'
                    className="group flex flex-col justify-center items-center w-8/12 border-4 border-pink-600 rounded-lg p-2 px-3 
                            text-white bg-black bg-opacity-60 hover:bg-pink-950 hover:scale-105 transition-all ease-out 
                            duration-400"
                >
                    <p className='group-hover:text-black text-center text-5xl'>Add Character</p>
                    <div className="group-hover:text-black w-full h-auto flex flex-col items-center justify-center text-4xl text-white">
                        <FaPlusSquare />
                    </div>
                </Link>
                <p className="text-center text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center justify-start gap-4">
            <h2 className='text-6xl w-10/12 text-white text-center border-b-2 border-white mb-4'>
                Your Characters
            </h2>
            <Link
                href='/add_Character'
                className="group flex flex-col justify-center items-center w-8/12 border-4 border-pink-600 rounded-lg p-2 px-3 
                        text-white bg-black bg-opacity-60 hover:bg-pink-950 hover:scale-105 transition-all ease-out 
                        duration-400"
            >
                <p className='group-hover:text-black text-center text-5xl'>Add Character</p>
                <div className="group-hover:text-black w-full h-auto flex flex-col items-center justify-center text-4xl text-white">
                    <FaPlusSquare />
                </div>
            </Link>
                <div className="w-11/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {characters.map((character) => (
                        <Link
                            key={character.id_character}
                            href={`/characters/by-id/${character.id_character}`} // Cambiado para coincidir con la ruta dinámica
                            className="group flex flex-col justify-start appearance-none w-full border-4 border-teal-600 rounded-lg p-2 px-3 text-white bg-black bg-opacity-60
                                hover:bg-teal-950 hover:scale-105 transition-all ease-out 
                                duration-400"
                        >
                            <div className="w-full h-auto flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out scale-150">
                                <IoMdArrowDropdown />
                            </div>
                            <div className="relative w-full h-48 my-2">
                                <img
                                    src={getClassImage(character.class_character)}
                                    alt={character.class_character}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                            </div>
                            <div
                                className='wfull h-auto flex flex-col items-center justify-center text-white border-y-2 border-white
                            my-2'>
                                <h3
                                    className="text-4xl text-center text-teal-400"
                                >
                                    {character.name_character}
                                </h3>
                                <div
                                    className='w-full h-auto flex items-start justify-start text-white px-2'>
                                    <h4 className="text-3xl">Class:</h4>
                                    <p className="text-3xl mx-3"> {character.class_character || 'N/A'}</p>
                                </div>
                                <div className='w-full h-auto flex items-start justify-start text-white px-2'>
                                    <h4 className="text-3xl">
                                        Level:
                                    </h4>
                                    <p className='text-3xl mx-3'>
                                        {character.level_character || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}

                </div>
            
        </div>
    );
};

export default CharacterGrid;