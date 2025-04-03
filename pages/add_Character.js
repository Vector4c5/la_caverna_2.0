import { Jersey_10 } from '@next/font/google';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Header from '@/components/common/Header';
import StarAnimation from '@/components/common/StartAnimation';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setError('El ID del usuario no está definido. Asegúrate de que el usuario esté logueado.');
            return;
        }

        console.log('Enviando personaje:', {
            id_user: userId,
            ...formData,
        });

        try {
            const response = await axios.post(`${backUrl}/characters`, {
                id_user: userId,
                ...formData,
            });
            console.log('Respuesta del backend:', response.data);
            setMessage(response.data.mensaje || 'Personaje creado exitosamente.');
            setError('');
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
        } catch (err) {
            console.error('Error al agregar el personaje:', err.response ? err.response.data : err);
            setError(err.response?.data?.error || 'Hubo un error al agregar el personaje. Intenta nuevamente.');
            setMessage('');
        }
    };

    return (
        <div className={`w-full mx-auto flex flex-col items-center justify-start p-4 overflow-y-auto ${jersey_10.className}`}>
            <div className='w-10/12 h-auto z-10'>
                <Header />
            </div>
            <StarAnimation />
            <img
                src="/Armario.jpeg"
                alt="landimg"
                layout="fill"
                className="object-cover w-full h-screen opacity-30 z-0 fixed"
            />

            <div className='z-10 w-full h-auto flex flex-col items-center justify-start gap-4'>

                <h1 className="text-4xl font-bold text-center my-8">Agregar Personaje</h1>
                <form onSubmit={handleSubmit} className="bg-black bg-opacity-60 border-4 border-white border-dashed w-8/12 shadow-md rounded-xl p-6">
                    <div className="Flex flex-col items-center justify-start gap-4">

                        <div className='w-full h-auto flex items-center justify-center'>
                            <div className='w-1/2 h-auto flex flex-col justify-center items-center gap-2'>
                                <div className='w-full h-auto flex items-center justify-start'>
                                    <label className="text-3xl whitespace-nowrap mx-4">Nombre del Personaje</label>
                                    <input
                                        type="text"
                                        name="name_character"
                                        value={formData.name_character}
                                        onChange={handleChange}
                                        className="w-full max-h-8 text-2xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    />
                                </div>
                                <div className='w-full h-auto flex items-center justify-start'>
                                    <label className="text-3xl whitespace-nowrap mx-4">Raza</label>
                                    <select
                                        name="race"
                                        value={formData.race}
                                        onChange={handleChange}
                                        className="w-full max-h-8 text-2xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    >
                                        <option value="" disabled>Selecciona una raza</option>
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

                            <div className='w-1/2 h-auto flex flex-col justify-center items-center gap-2'>
                                <div className='w-full h-auto flex items-center justify-start'>
                                    <label className="text-3xl whitespace-nowrap mx-4">Clase</label>
                                    <select
                                        name="class_character"
                                        value={formData.class_character}
                                        onChange={handleChange}
                                        className="w-full max-h-8 text-2xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    >
                                        <option value="" disabled>Selecciona una clase</option>
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
                                <div className='w-full h-auto flex items-center justify-start'>
                                    <label className="text-3xl whitespace-nowrap mx-4">Nivel</label>
                                    <input
                                        type="number"
                                        name="level_character"
                                        value={formData.level_character}
                                        onChange={handleChange}
                                        className="w-full max-h-8 text-2xl appearance-none border-b-2 border-white bg-gray-900 bg-opacity-50 px-2"
                                        required
                                    />
                                </div>
                            </div>
                        </div> 
                        {/* Espacio entre las dos columnas */}
                        
                            {/* Mostrar datos de la raza seleccionada */}
                        {raceData && (
                            <div className="w-full h-auto flex flex-col items-center justify-center bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                <h2 className="text-2xl text-white mb-4">Información de la Raza</h2>
                                <p className="text-white">Velocidad: {raceData.speed}</p>
                                <p className="text-white">Tamaño: {raceData.size}</p>
                                <p className="text-white">Descripción del Tamaño: {raceData.size_description}</p>
                                <h3 className="text-xl text-white mt-4">Bonificaciones de Habilidad:</h3>
                                <ul className="list-disc list-inside text-white">
                                    {raceData.ability_bonuses?.map((bonus, index) => (
                                        <li key={index}>{bonus.ability_score.name}: +{bonus.bonus}</li>
                                    ))}
                                </ul>
                                <h3 className="text-xl text-white mt-4">Idiomas:</h3>
                                <p className="text-white">{raceData.language_desc}</p>

                                {/* Mostrar Traits */}
                                <h2
                                    className="text-xl md:text-2xl text-center mb-4 text-white"
                                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                                >
                                    Racial Traits
                                </h2>
                                {raceData.traitsDetails && (
                                    <ul className="list-disc list-inside text-white">
                                        {raceData.traitsDetails.map((trait) => (
                                            <div key={trait.index} className="mb-4">
                                                <h3 className="text-lg md:text-xl font-bold text-white">{trait.name}</h3>
                                                <p className="text-white">{trait.desc[0]}</p>
                                            </div>
                                        ))}
                                    </ul>
                                )}

                                {/* Mostrar Subraces */}
                                {raceData.subracesDetails && raceData.subracesDetails.length > 0 && (
                                    <div className="mt-6">
                                        <h2
                                            className="text-xl md:text-2xl mb-4 text-white"
                                            style={{ fontFamily: "'Press Start 2P', cursive" }}
                                        >
                                            Subraces
                                        </h2>
                                        {raceData.subracesDetails.map((subrace) => (
                                            <div key={subrace.index} className="mb-4">
                                                <h3 className="text-lg md:text-xl font-bold text-white">{subrace.name}</h3>
                                                <p className="text-white">{subrace.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                            




                        <div>
                            <label className="block text-black mb-2">Fuerza</label>
                            <input
                                type="number"
                                name="strength"
                                value={formData.strength}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-black mb-2">Destreza</label>
                            <input
                                type="number"
                                name="dexterity"
                                value={formData.dexterity}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-black mb-2">Constitución</label>
                            <input
                                type="number"
                                name="constitution"
                                value={formData.constitution}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-black mb-2">Inteligencia</label>
                            <input
                                type="number"
                                name="intelligence"
                                value={formData.intelligence}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-black mb-2">Sabiduría</label>
                            <input
                                type="number"
                                name="wisdom"
                                value={formData.wisdom}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-black mb-2">Carisma</label>
                            <input
                                type="number"
                                name="charisma"
                                value={formData.charisma}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-black mb-2">Puntos de Golpe</label>
                            <input
                                type="number"
                                name="hit_points"
                                value={formData.hit_points}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-black mb-2">Clase de Armadura</label>
                            <input
                                type="number"
                                name="armor_class"
                                value={formData.armor_class}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-black mb-2">Iniciativa</label>
                            <input
                                type="number"
                                name="initiative"
                                value={formData.initiative}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-black mb-2">Velocidad</label>
                            <input
                                type="number"
                                name="speed"
                                value={formData.speed}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-black mb-2">Trasfondo</label>
                            <textarea
                                name="background"
                                value={formData.background}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                rows="4"
                                required
                            ></textarea>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Agregar Personaje
                    </button>
                </form>
                {message && <p className="text-green-500 mt-4">{message}</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

        </div>
    );
};

export default AddCharacter;
