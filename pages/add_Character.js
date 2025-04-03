import React, { useState } from 'react';
import axios from 'axios';

const AddCharacter = ({ userId }) => {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/characters`, {
                id_user: userId, // Se envía el ID del usuario iniciado
                ...formData,
            });
            setMessage(response.data.mensaje);
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
            console.error('Error al agregar el personaje:', err);
            setError('Hubo un error al agregar el personaje. Intenta nuevamente.');
            setMessage('');
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center my-8">Agregar Personaje</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Nombre del Personaje</label>
                        <input
                            type="text"
                            name="name_character"
                            value={formData.name_character}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Raza</label>
                        <input
                            type="text"
                            name="race"
                            value={formData.race}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Clase</label>
                        <input
                            type="text"
                            name="class_character"
                            value={formData.class_character}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Nivel</label>
                        <input
                            type="number"
                            name="level_character"
                            value={formData.level_character}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Fuerza</label>
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
                        <label className="block text-gray-700 font-bold mb-2">Destreza</label>
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
                        <label className="block text-gray-700 font-bold mb-2">Constitución</label>
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
                        <label className="block text-gray-700 font-bold mb-2">Inteligencia</label>
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
                        <label className="block text-gray-700 font-bold mb-2">Sabiduría</label>
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
                        <label className="block text-gray-700 font-bold mb-2">Carisma</label>
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
                        <label className="block text-gray-700 font-bold mb-2">Puntos de Golpe</label>
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
                        <label className="block text-gray-700 font-bold mb-2">Clase de Armadura</label>
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
                        <label className="block text-gray-700 font-bold mb-2">Iniciativa</label>
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
                        <label className="block text-gray-700 font-bold mb-2">Velocidad</label>
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
                        <label className="block text-gray-700 font-bold mb-2">Antecedentes</label>
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