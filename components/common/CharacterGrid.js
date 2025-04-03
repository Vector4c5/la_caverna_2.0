import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlusSquare } from "react-icons/fa";

const CharacterGrid = ({ userId }) => {
    const [characters, setCharacters] = useState([]); // Estado para almacenar los personajes
    const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        async function fetchCharacters() {
            try {
                setLoading(true); // Inicia el estado de carga
                setError(null); // Reinicia el estado de error

                console.log(`Fetching characters for userId: ${userId}`); // Log para verificar el userId
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/characters/${userId}`);
                console.log('API Response:', data); // Log para verificar la respuesta de la API

                // Verifica si la respuesta es un array o un objeto
                if (Array.isArray(data)) {
                    setCharacters(data); // Si es un array, guárdalo directamente
                } else if (data && typeof data === 'object') {
                    setCharacters([data]); // Si es un objeto, conviértelo en un array
                } else {
                    console.error('API response is not valid:', data);
                    setCharacters([]); // Si no es válido, establece un array vacío
                }
            } catch (error) {
                console.error('Error al obtener los personajes:', error);
                setError('No se pudieron cargar los personajes. Intenta nuevamente más tarde.');
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        }

        if (userId) {
            fetchCharacters(); // Llama a la función solo si `userId` está definido
        }
    }, [userId]);

    // Función para obtener la ruta de la imagen según la clase del personaje
    const getClassImage = (classCharacter) => {
        switch (classCharacter.toLowerCase()) {
            case 'hechicera':
                return '/Logo_The_Cavern.jpeg'; // Ruta de la imagen para "Hechicera"
            case 'guerrero':
                return '/guerrero.png'; // Ruta de la imagen para "Guerrero"
            case 'mago':
                return '/mago.png'; // Ruta de la imagen para "Mago"
            case 'arquero':
                return '/arquero.png'; // Ruta de la imagen para "Arquero"
            default:
                return '/default.png'; // Imagen por defecto si no coincide ninguna clase
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500">Cargando personajes...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="container mx-auto px-4">
            <h2 className='text-6xl text-white text-center border-b-2 border-white w-full p-4 mb-4'>
                Your Characters
            </h2>
            {characters.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {characters.map((character) => (
                        <Link
                            key={character.id_character}
                            href={`/characters/${character.id_character}`}
                            className="group flex flex-col justify-start appearance-none w-full border-4 border-teal-600 rounded-lg p-2 px-3 text-white bg-black bg-opacity-60
                                hover:bg-teal-950 hover:scale-105 transition-all ease-out 
                                duration-400"
                        >
                            <div className="w-full h-auto flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out scale-150">
                                <IoMdArrowDropdown />
                            </div>
                            <img
                                src={getClassImage(character.class_character)}
                                alt={character.class_character}
                                className="w-full h-32 object-cover rounded-lg my-2"
                            />
                            <h3 className="text-3xl text-center">{character.name_character}</h3>
                            <p className="text-xl">Nivel: {character.level_character || 'N/A'}</p>
                            <p className="text-xl">Clase: {character.class_character || 'N/A'}</p>
                        </Link>
                    ))}
                <Link
                    href='/add_Character'
                    className="group flex flex-col justify-center items-center w-full border-4 border-pink-600 rounded-lg p-2 px-3 
                    text-white bg-black bg-opacity-60 hover:bg-pink-950 hover:scale-105 transition-all ease-out 
                    duration-400"
                >
                    <p className='group-hover:text-black text-center text-5xl'>Agregar Persopnaje</p>
                    <div className="group-hover:text-black w-full h-auto my-3 flex flex-col items-center justify-center text-6xl text-white">
                        <FaPlusSquare />
                    </div>
                </Link>
            
                </div>
            ) : (
                <Link
                href='/add_Character'
                className="group flex flex-col justify-center items-center w-full border-4 border-pink-600 rounded-lg p-2 px-3 text-white bg-black bg-opacity-60
                hover:bg-pink-950 hover:scale-105 transition-all ease-out 
                duration-400"
                >
                    <p className='text-center'>Agregar Persopnaje</p>
                    <div className="w-full h-auto flex flex-col items-center justify-center opacity-100 scale-150">
                    <FaPlusSquare />
                    </div>
            </Link>
            )}
            
        </div>
    );
};

export default CharacterGrid;