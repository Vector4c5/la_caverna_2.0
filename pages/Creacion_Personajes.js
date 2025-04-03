import Link from 'next/link';
import Header from '@/components/common/Header';
import { Jersey_10 } from '@next/font/google';
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios';

const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });
const backUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Creacion_Personajes() {
    const { data: session, status } = useSession();
    const [characterData, setCharacterData] = useState({
        id_user: '',
        name_character: '',
        race: '',
        class: '',
        level_character: 1,
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        hit_points: 10,
        armor_class: 10,
        initiative: 0,
        speed: 30,
        background: '',
        skills: JSON.stringify({}), // Inicializa como un objeto vacío en formato JSON
        spells: JSON.stringify({}) // Inicializa como un objeto vacío en formato JSON
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = localStorage.getItem('loggedInUser');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setLoggedInUser(user);
                setCharacterData((prevData) => ({
                    ...prevData,
                    id_user: user.id_user
                }));
                setIsLoggedIn(true);
            } else if (session?.user?.email) {
                try {
                    const response = await axios.get(`${backUrl}/users`, {
                        params: { email: session.user.email }
                    });

                    if (response.data) {
                        setLoggedInUser(response.data);
                        setCharacterData((prevData) => ({
                            ...prevData,
                            id_user: response.data.id_user
                        }));
                        localStorage.setItem('loggedInUser', JSON.stringify(response.data));
                        setIsLoggedIn(true);
                    } else {
                        console.error('No se encontró el usuario en la base de datos.');
                    }
                } catch (error) {
                    console.error('Error al obtener el usuario desde la base de datos:', error);
                }
            }
        };

        fetchUser();
    }, [session]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCharacterData({
            ...characterData,
            [name]: value
        });
    };

    const handleJsonChange = (e, field) => {
        try {
            const jsonValue = JSON.parse(e.target.value);
            setCharacterData({
                ...characterData,
                [field]: JSON.stringify(jsonValue)
            });
        } catch (error) {
            console.error('El valor ingresado no es un JSON válido.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!characterData.id_user) {
            alert('No se puede crear el personaje porque el ID del usuario no está disponible.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${backUrl}/characters`, characterData);
            console.log('Personaje creado:', response.data);
            alert('Personaje creado exitosamente');
        } catch (error) {
            console.error('Error al crear el personaje:', error);
            alert('Hubo un error al crear el personaje');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return <p className="text-white text-2xl">Cargando...</p>;
    }

    if (!isLoggedIn) {
        return (
            <div className="relative container w-full h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl text-white mb-6">Debes iniciar sesión para crear un personaje</h1>
                <button onClick={() => signIn()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Iniciar sesión
                </button>
            </div>
        );
    }

    return (
        <main className={`flex min-h-screen flex-col items-center justify-between ${jersey_10.className}`}>
            <img src="/Armario.jpeg" alt="landimg" className="object-cover w-full h-screen opacity-30 z-0 fixed" />
            <div className="container w-10/12 h-24 flex flex-col m-10 items-center justify-start gap-5 z-10">
                <Header />
            </div>
            <div className="relative container w-full h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl text-white mb-6">Crear Personaje</h1>
                <form onSubmit={handleSubmit} className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name_character">Nombre del Personaje</label>
                    <input type="text" id="name_character" name="name_character" value={characterData.name_character} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700" required />

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="race">Raza</label>
                    <input type="text" id="race" name="race" value={characterData.race} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700" required />

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="class">Clase</label>
                    <input type="text" id="class" name="class" value={characterData.class} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700" required />

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="background">Historia</label>
                    <textarea id="background" name="background" value={characterData.background} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700" />

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skills">Habilidades (JSON)</label>
                    <textarea id="skills" name="skills" value={characterData.skills} onChange={(e) => handleJsonChange(e, 'skills')} className="shadow border rounded w-full py-2 px-3 text-gray-700" />

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="spells">Conjuros (JSON)</label>
                    <textarea id="spells" name="spells" value={characterData.spells} onChange={(e) => handleJsonChange(e, 'spells')} className="shadow border rounded w-full py-2 px-3 text-gray-700" />

                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" disabled={loading}>
                        {loading ? 'Creando...' : 'Crear Personaje'}
                    </button>
                </form>
            </div>
        </main>
    );
}
