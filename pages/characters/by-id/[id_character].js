import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { jsPDF } from 'jspdf';
import Header from '@/components/common/Header';
import StartAnimation from '@/components/common/StartAnimation';
import { Jersey_10 } from 'next/font/google';

const backUrl = process.env.NEXT_PUBLIC_API_URL;
const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });

const CharacterPage = () => {
    const router = useRouter();
    const { id_character } = router.query;
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [spells, setSpells] = useState(Array.from({ length: 9 }, () => []));
    const [skills, setSkills] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    // Función para obtener los detalles del personaje
    const fetchCharacterDetails = useCallback(async () => {
        if (!id_character) return;

        try {
            setLoading(true);
            const { data } = await axios.get(`${backUrl}/characters/by-id/${id_character}`);
            setCharacter(data);
        } catch (error) {
            console.error('Error al obtener los detalles del personaje:', error);
            setError('No se pudo cargar la información del personaje');
        } finally {
            setLoading(false);
        }
    }, [id_character]);

    // Función para obtener los hechizos desde la API
    const fetchSpells = useCallback(async () => {
        if (!character?.id_character) return;

        try {
            const { data } = await axios.get(`${backUrl}/spells/${character.id_character}`);
            const organizedSpells = Array.from({ length: 9 }, () => []);

            data.forEach((spell) => {
                const level = spell.level_spell;
                if (level >= 1 && level <= 9) {
                    organizedSpells[level - 1].push(spell);
                }
            });

            setSpells(organizedSpells);
        } catch (error) {
            console.error('Error al obtener los hechizos:', error);
        }
    }, [character?.id_character]);

    // Función para obtener las habilidades desde la API
    const fetchSkills = useCallback(async () => {
        if (!character?.id_character) return;

        try {
            const { data } = await axios.get(`${backUrl}/skills/${character.id_character}`);
            setSkills(data);
        } catch (error) {
            console.error('Error al obtener las habilidades:', error);
        }
    }, [character?.id_character]);

    // Función para generar el PDF
    const generatePDF = useCallback(async () => {
        if (!character) return;

        const doc = new jsPDF('portrait', 'mm', 'a4');

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
        const skillMaxWidth = 50; // Ancho máximo para las descripciones
        const skillLineHeight = 5; // Altura entre líneas

        if (!skills || skills.length === 0) {
            // Si no hay habilidades, mostrar un mensaje
            doc.text("Agrega tus habilidades", 145, currentY);
        } else {
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
        }

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

        if (!spells || spells.every(section => section.length === 0)) {
            // Si no hay hechizos en ninguna sección, mostrar un mensaje
            doc.text("No tiene hechizos registrados", 80, 50);
        } else {
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
        }

        // Generar el PDF como un archivo en memoria
        const pdfBlob = doc.output('blob'); // Genera el PDF como un Blob
        const pdfUrl = URL.createObjectURL(pdfBlob); // Crea una URL para el Blob
        setPdfPreview(pdfUrl); // Almacena la URL en el estado para mostrarla en la vista previa
    }, [character, spells, skills]);

    // Función para manejar la eliminación del personaje
    const handleDeleteCharacter = async () => {
        try {
            await axios.delete(`${backUrl}/characters/${id_character}`);
            // Mostrar mensaje de éxito
            alert('Personaje eliminado exitosamente');
            // Redirigir a la página de personajes
            router.push('/landing');
        } catch (error) {
            console.error('Error al eliminar el personaje:', error);
            alert('Error al eliminar el personaje');
        }
    };

    // Cargar datos del personaje cuando cambia el ID
    useEffect(() => {
        fetchCharacterDetails();
    }, [id_character, fetchCharacterDetails]);

    // Cargar los hechizos y habilidades cuando se carga el personaje
    useEffect(() => {
        if (character) {
            fetchSpells();
            fetchSkills();
        }
    }, [character, fetchSpells, fetchSkills]);

    // Generar el PDF cuando se tengan todos los datos
    useEffect(() => {
        if (character) {
            // Asegurarse de que spells y skills estén al menos definidos como arrays vacíos
            const hasLoadedSpells = Array.isArray(spells);
            const hasLoadedSkills = Array.isArray(skills);

            // Si ya tenemos el personaje y se intentó cargar skills y spells (aunque estén vacíos)
            if (hasLoadedSpells && hasLoadedSkills) {
                generatePDF();
            }
        }
    }, [character, spells, skills, generatePDF]);

    if (loading || !id_character) {
        return (
            <main className={`flex min-h-screen flex-col items-center justify-between bg-black  text-white ${jersey_10.className}`}>
                <div className="w-11/12 sm:w-10/12 lg:w-8/12 h-auto z-50 py-4">
                    <Header />
                </div>
                <StartAnimation />
                <div className="fixed inset-0 z-0">
                    <img
                        src="/Recamara.jpeg"
                        alt="Personajes Fondo"
                        layout="fill"
                        objectFit="cover"
                        className="opacity-30"
                    />
                </div>
                <div className="w-full h-auto flex items-center justify-center p-4 z-10">
                    <p className="text-center text-white text-2xl">Cargando información del personaje...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className={`flex min-h-screen flex-col items-center justify-between text-white bg-black ${jersey_10.className}`}>
                <div className="w-11/12 sm:w-10/12 lg:w-8/12 h-auto z-50 py-4">
                    <Header />
                </div>
                <StartAnimation />
                <div className="fixed inset-0 z-0">
                    <img
                        src="/Recamara.jpeg"
                        alt="Personajes Fondo"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="w-full h-auto flex items-center justify-center p-4 z-10">
                    <p className="text-center text-red-500 text-2xl">{error}</p>
                </div>
            </main>
        );
    }

    if (!character) {
        return (
            <main className={`flex min-h-screen flex-col items-center justify-between text-white bg-black ${jersey_10.className}`}>
                <div className="w-11/12 sm:w-10/12 lg:w-8/12 h-auto z-50 py-4">
                    <Header />
                </div>
                <StartAnimation />
                <div className="fixed inset-0 z-0">
                    <img
                        src="/Recamara.jpeg"
                        alt="Personajes Fondo"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="w-full h-auto flex items-center justify-center p-4 z-10">
                    <p className="text-center text-white text-2xl">No se encontró el personaje</p>
                </div>
            </main>
        );
    }

    return (
        <main className={`flex min-h-screen flex-col items-center justify-between bg-black text-white ${jersey_10.className}`}>
            <div className="w-11/12 sm:w-10/12 lg:w-8/12 h-auto z-50 py-4 text-white">
                <Header />
            </div>
            <StartAnimation />
            <div className="fixed inset-0 z-0">
                    <img
                        src="/Recamara.jpeg"
                        alt="Personajes Fondo"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
            <div className="w-full h-auto flex flex-col items-center justify-start p-4 gap-4 z-10">
                <div
                    className="w-full sm:w-10/12 lg:w-7/12 h-auto flex flex-col items-center justify-start p-4 gap-4 bg-black bg-opacity-60 z-10 border-4 border-white rounded-lg border-dashed">
                    <h1 className="w-full sm:w-2/3 text-4xl sm:text-5xl lg:text-6xl text-center border-b-2 border-white text-white">
                        {character.name_character}
                    </h1>
                    <div className="w-full flex flex-col items-start justify-center gap-4 pb-4 border-b-2 border-white">
                        <div className="w-full flex flex-col sm:flex-row items-center justify-around gap-4">
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
                                <h3 className="text-3xl sm:text-4xl text-yellow-400">
                                    Level:
                                </h3>
                                <p className="text-2xl sm:text-3xl text-white">
                                    {character.level_character || 'N/A'}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
                                <h3 className="text-3xl sm:text-4xl text-yellow-400">
                                    Class:
                                </h3>
                                <p className="text-2xl sm:text-3xl text-white">
                                    {character.class_character || 'N/A'}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
                                <h3 className="text-3xl sm:text-4xl text-yellow-400">
                                    Race:
                                </h3>
                                <p className="text-2xl sm:text-3xl text-white">
                                    {character.race || 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="w-full flex flex-col items-center justify-center">
                            <h3 className="w-full sm:w-2/3 text-3xl sm:text-4xl text-center text-teal-500">
                                Background:
                            </h3>
                            <p className="text-2xl sm:text-3xl text-justify text-white">
                                {character.background || 'Sin descripción'}
                            </p>
                        </div>
                    </div>

                    {/* Mostrar la vista previa del PDF si está disponible */}
                    {pdfPreview && (
                        <div className="w-full flex flex-col items-center justify-center mt-4">
                            <h2 className="text-3xl sm:text-4xl text-center mb-2 text-white4">
                                Get ready, a world full of adventures awaits you!
                            </h2>
                            <iframe
                                src={pdfPreview}
                                width="100%"
                                height="600"
                                className="border-2 border-gray-300 rounded-lg"
                            ></iframe>
                            <div className='flex flex-col sm:flex-row w-full mt-4 gap-3 sm:gap-2'>
                                <a
                                    href={pdfPreview}
                                    download={`${character.name_character}_HojaDePersonaje.pdf`}
                                    className="w-full text-center border-2 sm:border-3 md:border-4 border-green-500 
                text-white text-xl sm:text-2xl md:text-3xl 
                py-2 sm:py-3 md:py-3 lg:py-4 px-3 md:px-4 
                rounded-lg bg-black bg-opacity-50
                hover:bg-green-700 hover:scale-105 
                transition-all duration-500"
                                >
                                    Download PDF
                                </a>
                                <button
                                    onClick={() => router.back()}
                                    className="w-full text-center border-2 sm:border-3 md:border-4 border-teal-600 
                text-white text-xl sm:text-2xl md:text-3xl 
                py-2 sm:py-3 md:py-3 lg:py-4 px-3 md:px-4 
                rounded-lg bg-black bg-opacity-50
                hover:bg-teal-700 hover:scale-105 
                transition-all duration-500"
                                >
                                    Return to my characters"
                                </button>
                            </div>

                            <button
                                onClick={() => setShowDeleteConfirmation(true)}
                                className="mt-4 w-full text-center border-2 sm:border-3 md:border-4 border-red-600 
                text-white text-xl sm:text-2xl md:text-3xl 
                py-2 sm:py-2.5 md:py-3 px-3 md:px-4 
                rounded-lg bg-black bg-opacity-50
                hover:bg-red-700 hover:scale-105 
                transition-all duration-500"
                            >
                                Delete Character
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de confirmación */}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-gray-800 border-4 border-white p-6 rounded-lg w-11/12 sm:w-96 max-w-md">
                        <h3 className="text-2xl sm:text-3xl text-white text-center mb-6">
                            ¿Estás seguro de eliminar este personaje?
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleDeleteCharacter}
                                className="w-full sm:w-1/2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-xl rounded-lg transition-all hover:scale-105"
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirmation(false)}
                                className="w-full sm:w-1/2 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white text-xl rounded-lg transition-all hover:scale-105"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default CharacterPage;