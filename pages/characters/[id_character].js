import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Jersey_10 } from '@next/font/google';
import { useRouter } from 'next/router';
import { jsPDF } from 'jspdf';
import Header from '@/components/common/Header';
import StartAnimation from '@/components/common/StartAnimation'

const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });
const backUrl = process.env.NEXT_PUBLIC_API_URL;

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
    const [pdfPreview, setPdfPreview] = useState(null); // Estado para almacenar la URL del PDF generado

    // Si la página aún no está generada, muestra un estado de carga
    if (router.isFallback) {
        return <p className="text-center text-gray-500">Cargando personaje...</p>;
    }

    // Función para generar el PDF con una plantilla de hoja de personaje
    const generatePDF = async () => {
        if (!character) return; // Asegúrate de que `character` esté definido

        const doc = new jsPDF('portrait', 'mm', 'a4'); // Configuración del PDF (A4 vertical)

        // **Primera hoja**
        // Cargar la imagen de la plantilla para la primera hoja
        const img1 = await fetch('/Hoja_Personaje_1.jpg') // Ruta de la plantilla para la primera hoja
            .then((res) => res.blob())
            .then((blob) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            });

        // Agregar la imagen de fondo a la primera hoja
        doc.addImage(img1, 'PNG', 0, 0, 210, 297); // Ajusta las dimensiones según la hoja (A4: 210x297 mm)

        // Estilo del texto
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);

        // Posicionar el texto en la primera hoja
        doc.text(character.name_character, 50, 50); // Nombre del personaje
        doc.text(character.class_character, 50, 60); // Clase
        doc.text(character.race, 50, 70); // Raza
        doc.text(character.level_character.toString(), 50, 80); // Nivel
        doc.text(character.hit_points.toString(), 50, 90); // Puntos de golpe
        doc.text(character.armor_class.toString(), 50, 100); // Clase de armadura
        doc.text(character.initiative.toString(), 50, 110); // Iniciativa
        doc.text(character.speed.toString(), 50, 120); // Velocidad

        // Atributos
        doc.text(character.strength.toString(), 100, 140); // Fuerza
        doc.text(character.dexterity.toString(), 100, 150); // Destreza
        doc.text(character.constitution.toString(), 100, 160); // Constitución
        doc.text(character.intelligence.toString(), 100, 170); // Inteligencia
        doc.text(character.wisdom.toString(), 100, 180); // Sabiduría
        doc.text(character.charisma.toString(), 100, 190); // Carisma

        // **Segunda hoja**
        doc.addPage(); // Agregar una nueva página

        // Cargar la imagen de la plantilla para la segunda hoja
        const img2 = await fetch('/Hoja_Personaje_2.jpg') // Ruta de la plantilla para la segunda hoja
            .then((res) => res.blob())
            .then((blob) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            });

        // Agregar la imagen de fondo a la segunda hoja
        doc.addImage(img2, 'PNG', 0, 0, 210, 297);

        // Posicionar contenido en la segunda hoja
        doc.text('Segunda Hoja - Detalles adicionales', 50, 50);
        doc.text(`Background: ${character.background || 'Sin descripción'}`, 50, 60);

        // **Tercera hoja**
        doc.addPage(); // Agregar una nueva página

        // Cargar la imagen de la plantilla para la tercera hoja
        const img3 = await fetch('/Hoja_Personaje_3.jpg') // Ruta de la plantilla para la tercera hoja
            .then((res) => res.blob())
            .then((blob) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            });

        // Agregar la imagen de fondo a la tercera hoja
        doc.addImage(img3, 'PNG', 0, 0, 210, 297);

        // Posicionar contenido en la tercera hoja
        doc.text('Tercera Hoja - Notas adicionales', 50, 50);
        doc.text('Aquí puedes agregar más información sobre el personaje.', 50, 60);

        // Generar el PDF como un archivo en memoria
        const pdfBlob = doc.output('blob'); // Genera el PDF como un Blob
        const pdfUrl = URL.createObjectURL(pdfBlob); // Crea una URL para el Blob
        setPdfPreview(pdfUrl); // Almacena la URL en el estado para mostrarla en la vista previa
    };

    // Generar el PDF automáticamente al cargar la página
    useEffect(() => {
        if (character) {
            generatePDF();
        }
    }, [character]); // Ejecuta el efecto solo cuando `character` esté disponible

    return (
        <main className={`flex min-h-screen flex-col items-center justify-between ${jersey_10.className}`}>
            <div className='w-10/12 h-auto z-50 py-4'>
                <Header />
            </div>
            <StartAnimation />
            <img
                src="/Recamara.jpeg"
                alt="Personajes FOndp"
                layout="fill"
                className="object-cover w-full h-screen opacity-30 z-0 fixed"
            />
            <div
                className='w-full h-auto flex flex-col items-center justify-start p-4 gap-4 z-10'>
                <div
                    className='w-7/12 h-auto flex flex-col items-center justify-start p-4 gap-4 bg-black bg-opacity-60 z-10 border-4 border-white rounded-lg
                border-dashed'>
                    <h1
                        className="w-2/3 text-6xl text-center border-b-2 border-white">
                        {character.name_character}
                    </h1>
                    <div className="w-11/12 flex flex-col items-start justify-center gap-2 pb-4 border-b-2 border-white">
                        <div className='w-full flex items-center justify-around'>
                            <div className='flex gap-6 items-center'>
                                <h3 className="text-4xl text-yellow-400">
                                    Nivel:
                                </h3>
                                <p className='text-3xl'>
                                    {character.level_character || 'N/A'}
                                </p>
                            </div>
                            <div className='flex gap-6 items-center'>
                                <h3 className="text-4xl text-yellow-400">
                                    Clase:
                                </h3>
                                <p className='text-3xl'>
                                    {character.class_character || 'N/A'}
                                </p>
                            </div>
                            <div className='flex gap-6 items-center'>
                                <h3 className="text-4xl text-yellow-400">
                                    Raza:
                                </h3>
                                <p className='text-3xl'>
                                    {character.race || 'N/A'}
                                </p>
                            </div>

                        </div>
                        <div
                            className='w-full flex flex-col items-center justify-center'>
                            <h3 className="w-2/3 text-4xl text-center text-teal-500">Background: </h3>
                            <p className='text-3xl text-justify'>{character.background || 'Sin descripción'}</p>
                        </div>
                    </div>

                    {/* Mostrar la vista previa del PDF si está disponible */}
                    {pdfPreview && (
                        <div className="w-full flex flex-col items-center justify-center mt-4">
                            <h2 className="text-4xl text-center mb-4">Preparate, un mundo lleno de aventuras te espera</h2>
                            <iframe
                                src={pdfPreview}
                                width="100%"
                                height="1000"
                                className="border-2 border-gray-300 rounded-lg"
                            ></iframe>
                            <a
                                href={pdfPreview}
                                download={`${character.name_character}_HojaDePersonaje.pdf`}
                                className="mt-4 block text-center bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-all"
                            >
                                Descargar PDF
                            </a>
                        </div>
                    )}

                </div>


            </div>

        </main>
    );
};

// Exporta el componente como la exportación por defecto
export default CharacterPage;

export async function getStaticPaths() {
    try {
        const { data } = await axios.get(`${backUrl}/characters`);
        const paths = data && data.id_character
            ? [{ params: { id_character: data.id_character.toString() } }]
            : [];
        return { paths, fallback: true };
    } catch (error) {
        console.error('Error al obtener los personajes para las rutas dinámicas:', error);
        return { paths: [], fallback: true };
    }
}

export async function getStaticProps({ params }) {
    try {
        const { data } = await axios.get(
            `${backUrl}/characters/by-id/${params.id_character}`
        );
        return { props: { character: data }, revalidate: 10 };
    } catch (error) {
        console.error('Error al obtener el personaje:', error);
        return { notFound: true };
    }
}