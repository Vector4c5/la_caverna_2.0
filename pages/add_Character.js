import { Jersey_10 } from '@next/font/google';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Header from '@/components/common/Header';
import StarAnimation from '@/components/common/StartAnimation';
import { toast } from 'react-toastify';


const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });
const backUrl = process.env.NEXT_PUBLIC_API_URL;

const AddCharacter = () => {
    const { data: session } = useSession(); // Obtener la sesión del usuario
    const [userId, setUserId] = useState(null); // Estado para almacenar el ID del usuario
    const [formData, setFormData] = useState({
        name_character: '',
        race: '',
        class_character: '',
        level_character: '',
        strength: '',
        dexterity: '',
        constitution: '',
        intelligence: '',
        wisdom: '',
        charisma: '',
        hit_points: '',
        armor_class: '',
        initiative: '',
        speed: '',
        background: '',
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [raceData, setRaceData] = useState(null); // Estado para almacenar los datos de la raza seleccionada
    const [diceResults, setDiceResults] = useState(Array(6).fill([])); // Estado para almacenar los resultados de los 6 dados
    const [classData, setClassData] = useState(null); // Estado para almacenar los datos de la clase seleccionada
    const [skills, setSkills] = useState([]); // Estado para almacenar las habilidades dinámicas
    const [spells, setSpells] = useState([]); // Estado para almacenar los hechizos dinámicos

    // Obtener el userId desde localStorage o el backend
    useEffect(() => {
        const fetchUserId = async () => {
            const storedUser = localStorage.getItem('loggedInUser'); // Verificar si el usuario está en localStorage
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserId(parsedUser.id_user); // Asignar el ID del usuario desde localStorage
                console.log('ID del usuario obtenido de localStorage:', parsedUser.id_user);
            } else if (session && session.user) {
                try {
                    // Si no está en localStorage, buscar el usuario en el backend
                    const { data } = await axios.get(`${backUrl}/users_cavern`, {
                        params: { email: session.user.email },
                    });
                    setUserId(data.id_user); // Asignar el ID del usuario desde el backend
                    localStorage.setItem('loggedInUser', JSON.stringify(data)); // Guardar en localStorage
                    console.log('ID del usuario obtenido del backend:', data.id_user);
                } catch (error) {
                    console.error('Error al obtener el usuario desde el backend:', error);
                }
            } else {
                console.error('No se encontró información del usuario.');
            }
        };

        fetchUserId();
    }, [session]);

    // Obtener datos de la raza seleccionada
    useEffect(() => {
        const fetchRaceData = async () => {
            if (!formData.race) return;

            try {
                const formattedRace = formData.race.toLowerCase().replace(/\s+/g, '-');
                const response = await fetch(`https://www.dnd5eapi.co/api/races/${formattedRace}`);

                if (!response.ok) {
                    throw new Error('Race not found');
                }

                const data = await response.json();

                // Obtener detalles de traits y subraces
                if (data.traits && data.traits.length > 0) {
                    const traitsPromises = data.traits.map(async (trait) => {
                        const traitResponse = await fetch(`https://www.dnd5eapi.co${trait.url}`);
                        return traitResponse.json();
                    });
                    const traitsData = await Promise.all(traitsPromises);
                    data.traitsDetails = traitsData;
                }

                if (data.subraces && data.subraces.length > 0) {
                    const subracesPromises = data.subraces.map(async (subrace) => {
                        const subraceResponse = await fetch(`https://www.dnd5eapi.co${subrace.url}`);
                        return subraceResponse.json();
                    });
                    const subracesData = await Promise.all(subracesPromises);
                    data.subracesDetails = subracesData;
                }

                setRaceData(data); // Guardar los datos de la raza en el estado
            } catch (error) {
                console.error('Error al obtener los datos de la raza:', error);
                setRaceData(null);
            }
        };

        fetchRaceData();
    }, [formData.race]);

    // Obtener datos de la clase seleccionada
    useEffect(() => {
        const fetchClassData = async () => {
            if (!formData.class_character) return;

            try {
                const formattedClass = formData.class_character.toLowerCase();
                const response = await fetch(`https://www.dnd5eapi.co/api/classes/${formattedClass}`);

                if (!response.ok) {
                    throw new Error('Class not found');
                }

                const data = await response.json();
                setClassData(data); // Guardar los datos de la clase en el estado
            } catch (error) {
                console.error('Error al obtener los datos de la clase:', error);
                setClassData(null);
            }
        };

        fetchClassData();
    }, [formData.class_character]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: ['level_character', 'strength', 'dexterity', 'constitution',
                'intelligence', 'wisdom', 'charisma', 'hit_points',
                'armor_class', 'initiative', 'speed'].includes(name)
                ? value === "" ? "" : Number(value) // Permitir valores vacíos, de lo contrario convertir a número
                : value,
        });
    };

    const handleSkillChange = (index, field, value) => {
        const updatedSkills = [...skills];
        updatedSkills[index][field] = value;
        setSkills(updatedSkills);
    };

    const handleSpellChange = (index, field, value) => {
        const updatedSpells = [...spells];
        updatedSpells[index][field] = value;
        setSpells(updatedSpells);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            toast.error('El ID del usuario no está definido. Asegúrate de que el usuario esté logueado.', {
                position: "top-center",
                icon: "⚠️",
                toastId: 'user-id-error'
            });
            return;
        }

        try {
            // Mostrar toast de "Creando personaje..."
            toast.info('Creando tu personaje...', {
                position: "top-center",
                autoClose: 2000,
                icon: "⏳",
                toastId: 'creating-character'
            });

            // Crear el personaje primero
            const characterResponse = await axios.post(`${backUrl}/characters`, {
                id_user: userId,
                ...formData,
            });
            const id_character = characterResponse.data.id_character; // Obtener el ID del personaje creado

            console.log('Personaje creado con ID:', id_character);

            // Crear las habilidades asociadas al personaje
            for (const skill of skills) {
                try {
                    await axios.post(`${backUrl}/skills`, {
                        ...skill,
                        id_character,
                    });
                    console.log('Habilidad creada:', skill.name_skill);
                } catch (err) {
                    console.error(`Error al crear la habilidad "${skill.name_skill}":`, err.response?.data || err);

                    toast.warning(`No se pudo crear la habilidad "${skill.name_skill}"`, {
                        position: "bottom-right",
                        icon: "⚠️",
                        toastId: `skill-error-${skill.name_skill}`
                    });
                }
            }

            // Crear los hechizos asociados al personaje
            for (const spell of spells) {
                try {
                    await axios.post(`${backUrl}/spells`, {
                        name_spell: spell.name_spell,
                        description_spell: spell.description_spell,
                        level_spell: spell.level_spell,
                        id_character,
                    });
                    console.log('Hechizo creado:', spell.name_spell);
                } catch (err) {
                    console.error(`Error al crear el hechizo "${spell.name_spell}":`, err.response?.data || err);

                    toast.warning(`No se pudo crear el hechizo "${spell.name_spell}"`, {
                        position: "bottom-right",
                        icon: "⚠️",
                        toastId: `spell-error-${spell.name_spell}`
                    });
                }
            }

            // Toast de éxito
            toast.success(`¡${formData.name_character} ha sido creado exitosamente!`, {
                position: "top-center",
                icon: "🎉",
                autoClose: 5000,
                toastId: 'character-success'
            });

            // Limpiar el formulario
            setFormData({
                name_character: '',
                race: '',
                class_character: '',
                level_character: '',
                strength: '',
                dexterity: '',
                constitution: '',
                intelligence: '',
                wisdom: '',
                charisma: '',
                hit_points: '',
                armor_class: '',
                initiative: '',
                speed: '',
                background: '',
            });
            setSkills([]);
            setSpells([]);

        } catch (err) {
            console.error('Error al agregar el personaje:', err.response?.data || err);

            // Toast de error
            toast.error(err.response?.data?.error || 'Hubo un error al crear el personaje. Intenta nuevamente.', {
                position: "top-center",
                icon: "❌",
                toastId: 'character-error'
            });
        }
    };

    const rollDice = (diceIndex) => {
        const results = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 1);
        setDiceResults((prevResults) => {
            const newResults = [...prevResults];
            newResults[diceIndex] = results;
            return newResults;
        });

        // Mostrar el resultado más alto
        const highestRoll = Math.max(...results);
        toast.info(`¡Dados lanzados! Valor más alto: ${highestRoll}`, {
            position: "bottom-center",
            autoClose: 2000,
            icon: "🎲",
            toastId: `dice-roll-${Date.now()}`
        });
    };

    const addSkillInput = () => {
        setSkills([...skills, { name_skill: '', description_skill: '', level_skill: '' }]);
    };

    const removeSkillInput = (index) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);
    };

    const addSpellInput = () => {
        setSpells([...spells, { name_spell: '', description_spell: '', level_spell: '' }]);
    };

    const removeSpellInput = (index) => {
        const updatedSpells = spells.filter((_, i) => i !== index);
        setSpells(updatedSpells);
    };

    return (
        <main className={`w-full mx-auto flex flex-col items-center justify-start p-4 overflow-y-auto bg-black text-white ${jersey_10.className}`}>
            <div className="w-full sm:w-10/12 h-auto z-50">
                <Header />
            </div>
            <StarAnimation />
            <div className="fixed inset-0 z-0">
                <img
                    src="/Armario.jpeg"
                    alt="Personajes Fondo"
                    className="w-full h-full object-cover opacity-30"
                />
            </div>

            <div className="z-10 w-full h-auto flex flex-col items-center justify-start gap-4 text-white">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl text-center my-4 mt-8">
                    Create Your Character
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="bg-black bg-opacity-70 border-4 border-white border-dashed text-white w-full sm:w-10/12 lg:w-8/12 shadow-md rounded-xl p-4 sm:p-6"
                >
                    <div className="flex flex-col items-center justify-start gap-4">

                        <div className="w-full h-auto flex flex-col sm:flex-row items-center justify-center mb-4 border-b-2 border-white py-4 gap-4">
                            <div className="w-full sm:w-1/2 h-auto flex flex-col justify-center items-center gap-4">
                                <div className="w-full h-auto flex items-center justify-start">
                                    <label className="text-xl sm:text-2xl lg:text-3xl whitespace-nowrap mx-4">Character Name</label>
                                    <input
                                        type="text"
                                        name="name_character"
                                        value={formData.name_character}
                                        onChange={handleChange}
                                        className="w-full text-lg sm:text-xl lg:text-2xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    />
                                </div>
                                <div className="w-full h-auto flex items-center justify-start">
                                    <label className="text-xl sm:text-2xl lg:text-3xl whitespace-nowrap mx-4">Race</label>
                                    <select
                                        name="race"
                                        value={formData.race}
                                        onChange={handleChange}
                                        className="w-full text-lg sm:text-xl lg:text-2xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    >
                                        <option value="" disabled>Select Your Race</option>
                                        <option value="dragonborn">Dragonborn</option>
                                        <option value="dwarf">Dwarf</option>
                                        <option value="elf">Elf</option>
                                        <option value="gnome">Gnome</option>
                                        <option value="half-elf">Half-Elf</option>
                                        <option value="half-orc">Half-Orc</option>
                                        <option value="halfling">Halfling</option>
                                        <option value="human">Human</option>
                                        <option value="tiefling">Tiefling</option>
                                    </select>
                                </div>
                            </div>

                            <div className="w-full sm:w-1/2 h-auto flex flex-col justify-center items-center gap-4">
                                <div className="w-full h-auto flex items-center justify-start">
                                    <label className="text-xl sm:text-2xl lg:text-3xl whitespace-nowrap mx-4">Class</label>
                                    <select
                                        name="class_character"
                                        value={formData.class_character}
                                        onChange={handleChange}
                                        className="w-full text-lg sm:text-xl lg:text-2xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    >
                                        <option value="" disabled>Select Your Class</option>
                                        <option value="barbarian">Barbarian</option>
                                        <option value="bard">Bard</option>
                                        <option value="cleric">Cleric</option>
                                        <option value="druid">Druid</option>
                                        <option value="fighter">Fighter</option>
                                        <option value="monk">Monk</option>
                                        <option value="paladin">Paladin</option>
                                        <option value="ranger">Ranger</option>
                                        <option value="rogue">Rogue</option>
                                        <option value="sorcerer">Sorcerer</option>
                                        <option value="warlock">Warlock</option>
                                        <option value="wizard">Wizard</option>
                                    </select>
                                </div>
                                <div className="w-full h-auto flex items-center justify-start">
                                    <label className="text-xl sm:text-2xl lg:text-3xl whitespace-nowrap mx-4">Level</label>
                                    <input
                                        type="number"
                                        name="level_character"
                                        value={formData.level_character}
                                        onChange={handleChange}
                                        className="w-full text-lg sm:text-xl lg:text-2xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Espacio entre las dos columnas */}



                        <div className="w-full h-auto flex flex-col items-center justify-center gap-4 border-b-2 border-white pb-4 text-white">
                            {/* Primera fila de atributos */}
                            <div className="w-full h-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="w-full sm:w-1/3 h-auto flex items-center justify-start">
                                    <label className="text- sm:text-xl lg:text-3xl whitespace-nowrap mx-4">Strength</label>
                                    <input
                                        type="number"
                                        name="strength"
                                        value={formData.strength}
                                        onChange={handleChange}
                                        className="w-full text-base sm:text-lg lg:text-xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    />
                                </div>
                                <div className="w-full sm:w-1/3 h-auto flex items-center justify-start">
                                    <label className="text-lg sm:text-xl lg:text-3xl whitespace-nowrap mx-4">Dexterity</label>
                                    <input
                                        type="number"
                                        name="dexterity"
                                        value={formData.dexterity}
                                        onChange={handleChange}
                                        className="w-full text-base sm:text-lg lg:text-3xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    />
                                </div>
                                <div className="w-full sm:w-1/3 h-auto flex items-center justify-start">
                                    <label className="text-lg sm:text-xl lg:text-3xl whitespace-nowrap mx-4">Constitution</label>
                                    <input
                                        type="number"
                                        name="constitution"
                                        value={formData.constitution}
                                        onChange={handleChange}
                                        className="w-full text-base sm:text-lg lg:text-3xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Segunda fila de atributos */}
                            <div className="w-full h-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
                                <div className="w-full sm:w-1/3 h-auto flex items-center justify-start">
                                    <label className="text-lg sm:text-xl lg:text-3xl whitespace-nowrap mx-4">Intelligence</label>
                                    <input
                                        type="number"
                                        name="intelligence"
                                        value={formData.intelligence}
                                        onChange={handleChange}
                                        className="w-full text-base sm:text-lg lg:text-3xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    />
                                </div>
                                <div className="w-full sm:w-1/3 h-auto flex items-center justify-start">
                                    <label className="text-lg sm:text-xl lg:text-3xl whitespace-nowrap mx-4">Wisdom</label>
                                    <input
                                        type="number"
                                        name="wisdom"
                                        value={formData.wisdom}
                                        onChange={handleChange}
                                        className="w-full text-base sm:text-lg lg:text-xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    />
                                </div>
                                <div className="w-full sm:w-1/3 h-auto flex items-center justify-start">
                                    <label className="text-lg sm:text-xl lg:text-3xl whitespace-nowrap mx-4">Charisma</label>
                                    <input
                                        type="number"
                                        name="charisma"
                                        value={formData.charisma}
                                        onChange={handleChange}
                                        className="w-full text-base sm:text-lg lg:text-3xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Lógica de dados */}
                            <div className="w-full h-auto flex flex-col items-center justify-center gap-4 pb-4 text-white">
                                <h2 className="w-full sm:w-5/12 text-2xl sm:text-3xl lg:text-4xl text-white border-b-2 border-white text-center">Roll Dice</h2>
                                <p className="text-lg sm:text-xl lg:text-3xl text-center text-white">Don&apos;t have dice? Don&apos;t worry, try your luck with ours!</p>
                                <div className="w-full">
                                    {[...Array(1)].map((_, index) => (
                                        <div key={index} className="w-full flex flex-col items-center justify-center rounded-lg shadow-md gap-4">
                                            <ul className="flex flex-wrap justify-center w-full text-white mt-2 gap-4">
                                                {diceResults[index]?.map((result, i) => (
                                                    <li
                                                        className="flex flex-col justify-center items-center bg-teal-500 bg-opacity-50 p-2 border-2 border-teal-300"
                                                        key={i}
                                                    >
                                                        <p className="text-base sm:text-lg lg:text-3xl">Dice {i + 1}:</p>
                                                        <p className="text-base sm:text-lg lg:text-3xl">{result}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    rollDice(index);
                                                }}
                                                className="appearance-none w-full sm:w-5/12 h-auto border-4 border-pink-500 rounded-lg p-2 sm:p-3 lg:p-4 text-lg sm:text-xl lg:text-3xl text-white text-center 
                        bg-black bg-opacity-60 hover:bg-pink-300 hover:text-black hover:scale-105 transition-all ease-out duration-400"
                                            >
                                                Throw
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>


                        {/*   */}
                        <div className="w-full h-auto flex flex-col sm:flex-row justify-center items-center text-white gap-4 border-b-2 border-white py-4">
                            {/* Primera columna: Hit Points y Armor Class */}
                            <div className="w-full sm:w-1/2 h-auto flex flex-col justify-center items-center gap-4">
                                <div className="w-full h-auto flex items-center justify-start">
                                    <label className="text-lg sm:text-xl lg:text-2xl whitespace-nowrap mx-4">Hit Points</label>
                                    <input
                                        type="number"
                                        name="hit_points"
                                        value={formData.hit_points}
                                        onChange={handleChange}
                                        className="w-full text-base sm:text-lg lg:text-xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    />
                                </div>
                                <div className="w-full h-auto flex items-center justify-start">
                                    <label className="text-lg sm:text-xl lg:text-2xl whitespace-nowrap mx-4">Armor Class</label>
                                    <input
                                        type="number"
                                        name="armor_class"
                                        value={formData.armor_class}
                                        onChange={handleChange}
                                        className="w-full text-base sm:text-lg lg:text-xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Segunda columna: Initiative y Speed */}
                            <div className="w-full sm:w-1/2 h-auto flex flex-col justify-center items-center gap-4 text-white">
                                <div className="w-full h-auto flex items-center justify-start">
                                    <label className="text-lg sm:text-xl lg:text-2xl whitespace-nowrap mx-4">Initiative</label>
                                    <input
                                        type="number"
                                        name="initiative"
                                        value={formData.initiative}
                                        onChange={handleChange}
                                        className="w-full text-base sm:text-lg lg:text-xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    />
                                </div>
                                <div className="w-full h-auto flex items-center justify-start">
                                    <label className="text-lg sm:text-xl lg:text-2xl whitespace-nowrap mx-4">Speed</label>
                                    <input
                                        type="number"
                                        name="speed"
                                        value={formData.speed}
                                        onChange={handleChange}
                                        className="w-full text-base sm:text-lg lg:text-xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Background Section */}
                        <div className="w-full h-auto flex flex-col items-start justify-center py-4 text-white">
                            <label className="text-lg sm:text-xl lg:text-2xl whitespace-nowrap">Background</label>
                            <textarea
                                name="background"
                                value={formData.background}
                                onChange={handleChange}
                                className="w-full h-auto min-h-32 text-base sm:text-lg lg:text-xl appearance-none border-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                required
                            ></textarea>
                        </div>
                        {/*   */}

                        <div className="w-full h-auto flex flex-col sm:flex-row items-start justify-start py-4 gap-4 text-white">
                            {/* Skills Section */}
                            <div className="w-full sm:w-1/2 h-auto flex flex-col items-center justify-start py-4 mb-auto gap-4">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl whitespace-nowrap">Skills</h2>
                                {skills.map((skill, index) => (
                                    <div key={index} className="w-full h-auto flex flex-col items-start justify-start pt-2 mb-4 border-b-2 border-white gap-2">
                                        <label className="text-lg sm:text-xl lg:text-2xl whitespace-nowrap">Skill Name</label>
                                        <input
                                            type="text"
                                            name="name_skill"
                                            value={skill.name_skill}
                                            onChange={(e) => handleSkillChange(index, 'name_skill', e.target.value)}
                                            className="w-full text-base sm:text-lg lg:text-xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                            required
                                        />

                                        <label className="text-lg sm:text-xl lg:text-2xl whitespace-nowrap">Level Skill</label>
                                        <input
                                            type="number"
                                            name="level_skill"
                                            value={skill.level_skill}
                                            onChange={(e) => handleSkillChange(index, 'level_skill', e.target.value)}
                                            className="w-full text-base sm:text-lg lg:text-xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                            required
                                        />

                                        <label className="text-lg sm:text-xl lg:text-2xl whitespace-nowrap">Skill Description</label>
                                        <textarea
                                            name="description_skill"
                                            value={skill.description_skill}
                                            onChange={(e) => handleSkillChange(index, 'description_skill', e.target.value)}
                                            className="w-full h-auto min-h-32 text-base sm:text-lg lg:text-xl appearance-none border-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                            required
                                        ></textarea>

                                        <button
                                            type="button"
                                            onClick={() => removeSkillInput(index)}
                                            className="appearance-none w-full sm:w-5/12 h-auto my-4 border-4 border-red-700 rounded-lg p-2 sm:p-3 lg:p-4 text-base sm:text-lg lg:text-xl text-white text-center 
                    bg-black bg-opacity-60 hover:bg-red-500 hover:text-black hover:scale-105 transition-all ease-out duration-400"
                                        >
                                            Remove Skill
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addSkillInput}
                                    className="appearance-none w-full sm:w-11/12 h-auto border-4 border-yellow-600 rounded-lg p-2 sm:p-3 lg:p-4 text-base sm:text-lg lg:text-xl text-white text-center 
            bg-black bg-opacity-60 hover:bg-yellow-300 hover:text-black hover:scale-105 transition-all ease-out duration-400"
                                >
                                    Add Skill
                                </button>
                            </div>

                            {/* Spells Section */}
                            <div className="w-full sm:w-1/2 h-auto flex flex-col items-center justify-start py-4 mb-auto gap-4 text-white">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl whitespace-nowrap">Spells</h2>
                                {spells.map((spell, index) => (
                                    <div key={index} className="w-full h-auto flex flex-col items-start justify-start pt-2 mb-4 border-b-2 border-white gap-2">
                                        <label className="text-lg sm:text-xl lg:text-2xl whitespace-nowrap">Spell Name</label>
                                        <input
                                            type="text"
                                            name="name_spell"
                                            value={spell.name_spell}
                                            onChange={(e) => handleSpellChange(index, 'name_spell', e.target.value)}
                                            className="w-full text-base sm:text-lg lg:text-xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                            required
                                        />

                                        <label className="text-lg sm:text-xl lg:text-2xl whitespace-nowrap">Spell Level</label>
                                        <input
                                            type="number"
                                            name="level_spell"
                                            value={spell.level_spell}
                                            onChange={(e) => handleSpellChange(index, 'level_spell', e.target.value)}
                                            className="w-full text-base sm:text-lg lg:text-xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                            required
                                        />

                                        <label className="text-lg sm:text-xl lg:text-2xl whitespace-nowrap">Spell Description</label>
                                        <textarea
                                            name="description_spell"
                                            value={spell.description_spell}
                                            onChange={(e) => handleSpellChange(index, 'description_spell', e.target.value)}
                                            className="w-full h-auto min-h-32 text-base sm:text-lg lg:text-xl appearance-none border-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                            required
                                        ></textarea>

                                        <button
                                            type="button"
                                            onClick={() => removeSpellInput(index)}
                                            className="appearance-none w-full sm:w-5/12 h-auto my-4 border-4 border-red-700 rounded-lg p-2 sm:p-3 lg:p-4 text-base sm:text-lg lg:text-xl text-white text-center 
                    bg-black bg-opacity-60 hover:bg-red-500 hover:text-black hover:scale-105 transition-all ease-out duration-400"
                                        >
                                            Remove Spell
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addSpellInput}
                                    className="appearance-none w-full sm:w-11/12 h-auto border-4 border-yellow-600 rounded-lg p-2 sm:p-3 lg:p-4 text-base sm:text-lg lg:text-xl text-white text-center 
            bg-black bg-opacity-60 hover:bg-yellow-300 hover:text-black hover:scale-105 transition-all ease-out duration-400"
                                >
                                    Add Spell
                                </button>
                            </div>
                        </div>
                        {/*   */}
                    </div>

                    {/*   */}

                    <div className="w-full h-auto flex items-center justify-center my-4">
                        <button
                            type="submit"
                            className="appearance-none w-full sm:w-10/12 border-4 border-teal-600 rounded-lg p-2 sm:p-3 lg:p-4 text-lg sm:text-2xl lg:text-4xl text-white bg-black bg-opacity-60
        hover:bg-teal-300 hover:text-black hover:scale-105 transition-all ease-out duration-400"
                        >
                            Add Character
                        </button>
                    </div>

                    <div className="w-full h-auto flex flex-col items-center justify-center my-4 border-y-4 border-white gap-4">
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl text-white py-2 text-center">
                            Useful Information
                        </h2>
                        <div className="w-full h-auto flex flex-col sm:flex-row items-start justify-center gap-4">
                            {raceData && (
                                <div className="w-full sm:w-1/2 h-auto flex flex-col items-start justify-center p-4 rounded-lg text-white gap-4">
                                    <h2 className="w-full text-2xl sm:text-4xl lg:text-5xl mb-4 text-center">Race Information</h2>

                                    <h3 className="text-lg sm:text-2xl lg:text-3xl text-yellow-500">Speed:</h3>
                                    <p className="text-base sm:text-xl lg:text-2xl">{raceData.speed}</p>

                                    <h3 className="text-lg sm:text-2xl lg:text-3xl text-yellow-500">Size:</h3>
                                    <p className="text-base sm:text-xl lg:text-2xl">{raceData.size}</p>

                                    <h3 className="text-lg sm:text-2xl lg:text-3xl text-yellow-500">Size Description:</h3>
                                    <p className="text-base sm:text-xl lg:text-2xl">{raceData.size_description}</p>

                                    <h3 className="text-lg sm:text-2xl lg:text-3xl mt-4 text-yellow-500">Ability Score Bonuses:</h3>
                                    <ul className="list-disc list-inside text-base sm:text-xl lg:text-2xl">
                                        {raceData.ability_bonuses?.map((bonus, index) => (
                                            <li key={index}>{bonus.ability_score.name}: +{bonus.bonus}</li>
                                        ))}
                                    </ul>

                                    <h3 className="text-lg sm:text-2xl lg:text-3xl mt-4 text-yellow-500">Languages:</h3>
                                    <p className="text-base sm:text-xl lg:text-2xl">{raceData.language_desc}</p>

                                    <h2 className="w-full text-2xl sm:text-4xl lg:text-5xl mb-4 text-center">Racial Traits</h2>
                                    {raceData.traitsDetails && (
                                        <ul className="list-disc list-inside text-base sm:text-xl lg:text-2xl text-white">
                                            {raceData.traitsDetails.map((trait) => (
                                                <div key={trait.index} className="mb-4">
                                                    <h3 className="text-lg sm:text-2xl lg:text-3xl text-yellow-500">{trait.name}</h3>
                                                    <p>{trait.desc[0]}</p>
                                                </div>
                                            ))}
                                        </ul>
                                    )}

                                    {raceData.subracesDetails && raceData.subracesDetails.length > 0 && (
                                        <div className="mt-6">
                                            <h2 className="text-lg sm:text-xl lg:text-2xl mb-4 text-white">Subraces</h2>
                                            {raceData.subracesDetails.map((subrace) => (
                                                <div key={subrace.index} className="mb-4">
                                                    <h3 className="text-base sm:text-lg lg:text-xl text-white">{subrace.name}</h3>
                                                    <p className="text-base sm:text-lg lg:text-xl text-white">{subrace.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {classData && (
                                <div className="w-full sm:w-1/2 h-auto flex flex-col items-center justify-center p-4 rounded-lg text-white gap-4">
                                    <h2 className="w-full text-2xl sm:text-4xl lg:text-5xl mb-4 text-center">Class Information</h2>
                                    <div className="w-full h-auto flex flex-col items-start justify-center gap-4">
                                        <p className="text-lg sm:text-2xl lg:text-3xl text-cyan-500">
                                            Hit Die: <span className="text-base sm:text-xl lg:text-2xl text-white">d{classData.hit_die}</span>
                                        </p>

                                        <h3 className="text-lg sm:text-2xl lg:text-3xl text-cyan-500">When you start with this class, you must...</h3>
                                        <ul className="list-disc list-inside text-base sm:text-xl lg:text-2xl">
                                            {classData.proficiency_choices?.map((choice, index) => (
                                                <li key={index}>{choice.desc}</li>
                                            ))}
                                        </ul>

                                        <h3 className="text-lg sm:text-2xl lg:text-3xl text-cyan-500">Proficiencies:</h3>
                                        <ul className="list-disc list-inside text-base sm:text-xl lg:text-2xl">
                                            {classData.proficiencies?.map((prof) => (
                                                <li key={prof.index}>{prof.name}</li>
                                            ))}
                                        </ul>

                                        <h3 className="text-lg sm:text-2xl lg:text-3xl text-cyan-500">Starting Equipment:</h3>
                                        <ul className="list-disc list-inside text-base sm:text-xl lg:text-2xl">
                                            {classData.starting_equipment?.map((equip, index) => (
                                                <li key={index}>{equip.equipment.name} x {equip.quantity}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
                {message && <p className="text-green-500 mt-4">{message}</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

        </main>
    );
};

export default AddCharacter;
