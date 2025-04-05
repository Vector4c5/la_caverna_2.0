import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Jersey_10 } from '@next/font/google';
import { useRouter } from 'next/router';
import { jsPDF } from 'jspdf';
import Header from '@/components/common/Header';
import StartAnimation from '@/components/common/StartAnimation';

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
    const [spells, setSpells] = useState([]); // Estado para almacenar los hechizos organizados por nivel
    const [skills, setSkills] = useState([]); // Estado para almacenar las habilidades

    // Si la página aún no está generada, muestra un estado de carga
    if (router.isFallback) {
        return <p className="text-center text-gray-500">Cargando personaje...</p>;
    }

    // Función para obtener los hechizos desde la API
    const fetchSpells = async () => {
        try {
            const { data } = await axios.get(`${backUrl}/spells/${character.id_character}`);
            const organizedSpells = Array.from({ length: 9 }, () => []); // Crear 9 secciones vacías

            // Organizar los hechizos por nivel
            data.forEach((spell) => {
                const level = spell.level_spell;
                if (level >= 1 && level <= 9) {
                    organizedSpells[level - 1].push(spell); // Agregar el hechizo a la sección correspondiente
                }
            });

            setSpells(organizedSpells); // Actualizar el estado con los hechizos organizados
        } catch (error) {
            console.error('Error al obtener los hechizos:', error);
        }
    };

    // Función para obtener las habilidades desde la API
    const fetchSkills = async () => {
        try {
            const { data } = await axios.get(`${backUrl}/skills/${character.id_character}`);
            setSkills(data); // Actualizar el estado con las habilidades
        } catch (error) {
            console.error('Error al obtener las habilidades:', error);
        }
    };

    // Llamar a las funciones para obtener los hechizos y habilidades cuando el componente se monte
    useEffect(() => {
        if (character) {
            fetchSpells();
            fetchSkills();
        }
    }, [character]);

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
        const fontResponse = await fetch('/fonts/Jersey10-Regular.ttf'); // Ruta de la fuente personalizada
        const fontBlob = await fontResponse.blob();
        
        const fontBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]); // Obtener solo el contenido Base64
            reader.readAsDataURL(fontBlob);
        });

        // Agregar la fuente personalizada
        doc.addFileToVFS('Jersey10-Regular.tff', fontBase64);
        doc.addFont('Jersey10-Regular.tff', 'Jersey10', 'normal');


        // Usar la fuente personalizada
        doc.setFont('Jersey10', 'normal');
        doc.setFontSize(20);

        // Posicionar el texto en la primera hoja
        doc.text(character.name_character, 35, 35); // Nombre del personaje
        doc.setFontSize(15);
        doc.text(character.class_character, 93, 29); // Clase
        doc.text(character.level_character.toString(), 115, 29); // Nivel
        doc.text(character.race, 93, 38); // Raza
        doc.text(character.hit_points.toString(), 120, 81); // Puntos de golpe

        doc.setFontSize(20);
        doc.text(character.armor_class.toString(), 83.5, 65); // Clase de armadura
        doc.text(character.initiative.toString(), 103.5, 65); // Iniciativa
        doc.text(character.speed.toString(), 122.5, 65); // Velocidad

        // Atributos
        doc.text(character.strength.toString(), 16, 70); // Fuerza
        doc.text(character.dexterity.toString(), 16, 95); // Destreza
        doc.text(character.constitution.toString(), 16, 120); // Constitución
        doc.text(character.intelligence.toString(), 16, 145); // Inteligencia
        doc.text(character.wisdom.toString(), 16, 170); // Sabiduría
        doc.text(character.charisma.toString(), 16, 195); // Carisma

        // **Agregar habilidades a la primera hoja**
        doc.setFontSize(18); // Tamaño de la fuente para las habilidades
        doc.text("Habilidades:", 145, 150); // Título de la sección de habilidades

        doc.setFontSize(12); // Tamaño de la fuente para las habilidades
        let currentY = 155; // Posición inicial para las habilidades
        const skillMaxWidth = 80; // Ancho máximo para las descripciones
        const skillLineHeight = 5; // Altura entre líneas

        skills.forEach((skill) => {
            // Agregar el nombre de la habilidad
            if (currentY + skillLineHeight > 280) {
                // Si excede el límite de la hoja, no agregar más habilidades
                doc.text("...", 145, currentY);
                return;
            }
            doc.text(`- ${skill.name_skill}:`, 145, currentY); // Nombre de la habilidad
            currentY += skillLineHeight;

            // Dividir la descripción de la habilidad en líneas si excede el ancho máximo
            const skillLines = doc.splitTextToSize(skill.description_skill, skillMaxWidth);

            // Agregar cada línea de la descripción
            skillLines.forEach((line) => {
                if (currentY + skillLineHeight > 280) {
                    // Si excede el límite de la hoja, no agregar más habilidades
                    doc.text("...", 145, currentY);
                    return;
                }
                doc.text(line, 145, currentY); // Descripción con sangría
                currentY += skillLineHeight;
            });
        });

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

        // Agregar el nombre del personaje en la segunda hoja
        doc.setFontSize(16); // Tamaño de la fuente
        doc.text(character.name_character, 35, 35); // Posición del texto (x = 20, y = 40)

        // Posicionar contenido en la segunda hoja
        const backgroundText = character.background || 'Sin descripción';
        const maxWidth = 60; // Ancho máximo en milímetros
        const lines = doc.splitTextToSize(backgroundText, maxWidth);

        let y = 150; // Posición inicial en el eje Y (después del nombre del personaje)
        const lineHeight = 5; // Altura entre líneas

        lines.forEach((line) => {
            if (y + lineHeight > 280) { // Limitar el texto dentro de un área (por ejemplo, hasta 280 mm en Y)
                doc.text("...", 20, y); // Agregar puntos suspensivos si el texto excede el área
                return;
            }
            doc.text(line, 10, y);
            y += lineHeight;
        });

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

        // Posicionar las 9 secciones de hechizos
        doc.setFontSize(12); // Tamaño de la fuente para los hechizos

        const sectionPositions = [
            { x: 12, y: 133 }, // Posición para la sección 1
            { x: 12, y: 213 }, // Posición para la sección 2
            { x: 80, y: 73 }, // Posición para la sección 3
            { x: 80, y: 152 }, // Posición para la sección 4
            { x: 80, y: 232 }, // Posición para la sección 5
            { x: 145, y: 73 }, // Posición para la sección 6
            { x: 145, y: 133 }, // Posición para la sección 7
            { x: 145, y: 193 }, // Posición para la sección 8
            { x: 145, y: 242 }, // Posición para la sección 9
        ];

        spells.forEach((section, index) => {
            const position = sectionPositions[index]; // Obtener la posición de la sección
            let currentY = position.y; // Posición inicial para los hechizos dentro de la sección
            const maxWidth = 50; // Ancho máximo para las descripciones
            const lineHeight = 4; // Altura entre líneas

            // Listar los hechizos de la sección
            section.forEach((spell) => {
                if (currentY + lineHeight > 280) {
                    // Si excede el límite de la hoja, no agregar más hechizos
                    doc.text("...", position.x, currentY);
                    return;
                }

                // Agregar el nombre del hechizo
                doc.text(`- ${spell.name_spell}`, position.x, currentY);
                currentY += lineHeight;

                // Dividir la descripción en líneas si excede el ancho máximo
                const descriptionLines = doc.splitTextToSize(spell.description_spell, maxWidth);

                // Agregar cada línea de la descripción
                descriptionLines.forEach((line) => {
                    if (currentY + lineHeight > 290) {
                        // Si excede el límite de la hoja, no agregar más líneas
                        doc.text("...", position.x, currentY);
                        return;
                    }
                    doc.text(line, position.x + 6, currentY); // Descripción con sangría
                    currentY += lineHeight;
                });
            });
        });

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
    }, [character, spells, skills]); // Ejecuta el efecto solo cuando `character`, `spells` o `skills` cambien

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