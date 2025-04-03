import { Jersey_10 } from '@next/font/google';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: ['level_character', 'strength', 'dexterity', 'constitution',
                'intelligence', 'wisdom', 'charisma', 'hit_points',
                'armor_class', 'initiative', 'speed'].includes(name)
                ? Number(value) || 10 // Convertir a número, si es inválido pone 10
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
        <div className={`container mx-auto px-4 text-black ${jersey_10.className}`}>
            <h1 className="text-4xl font-bold text-center my-8">Agregar Personaje</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: 'Nombre del Personaje', name: 'name_character', type: 'text' },
                        { label: 'Raza', name: 'race', type: 'text' },
                        { label: 'Clase', name: 'class_character', type: 'text' },
                        { label: 'Nivel', name: 'level_character', type: 'number' },
                        { label: 'Fuerza', name: 'strength', type: 'number' },
                        { label: 'Destreza', name: 'dexterity', type: 'number' },
                        { label: 'Constitución', name: 'constitution', type: 'number' },
                        { label: 'Inteligencia', name: 'intelligence', type: 'number' },
                        { label: 'Sabiduría', name: 'wisdom', type: 'number' },
                        { label: 'Carisma', name: 'charisma', type: 'number' },
                        { label: 'Puntos de Golpe', name: 'hit_points', type: 'number' },
                        { label: 'Clase de Armadura', name: 'armor_class', type: 'number' },
                        { label: 'Iniciativa', name: 'initiative', type: 'number' },
                        { label: 'Velocidad', name: 'speed', type: 'number' },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-black mb-2">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>
                    ))}
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
    );
};

export default AddCharacter;
