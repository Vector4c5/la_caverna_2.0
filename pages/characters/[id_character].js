import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

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

const CharacterPage = ({ character }) => {
    const router = useRouter();

    // Si la página aún no está generada, muestra un estado de carga
    if (router.isFallback) {
        return <p className="text-center text-gray-500">Cargando personaje...</p>;
    }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center my-8">{character.name_character}</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <img
                    src={getClassImage(character.class_character)}
                    alt={character.class_character}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <p className="text-lg"><strong>Descripción:</strong> {character.background || 'Sin descripción'}</p>
                <p className="text-lg"><strong>Nivel:</strong> {character.level_character || 'N/A'}</p>
                <p className="text-lg"><strong>Clase:</strong> {character.class_character || 'N/A'}</p>
                <p className="text-lg"><strong>Raza:</strong> {character.race || 'N/A'}</p>
            </div>
        </div>
    );
};

export async function getStaticPaths() {
    // Obtén todos los personajes para generar las rutas dinámicas
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/characters`);
    const paths = Array.isArray(data)
        ? data.map((character) => ({
            params: { id_character: character.id_character.toString() },
        }))
        : [];

    return {
        paths,
        fallback: true, // Permite generar páginas dinámicas bajo demanda
    };
}

export async function getStaticProps({ params }) {
    try {
        // Obtén los datos del personaje basado en el id_character
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/characters/${params.id_character}`
        );

        return {
            props: {
                character: data,
            },
            revalidate: 10, // Revalida la página cada 10 segundos
        };
    } catch (error) {
        console.error('Error al obtener el personaje:', error);
        return {
            notFound: true, // Muestra una página 404 si no se encuentra el personaje
        };
    }
}

export default CharacterPage;