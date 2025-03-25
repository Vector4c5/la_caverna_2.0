import { Jersey_10 } from '@next/font/google';
import StarAnimation from "../components/common/StartAnimation";
import Link from "next/link";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession, signIn, signOut } from 'next-auth/react';

const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });
const backUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [nameUser, setNameUser] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [passwordUser, setPasswordUser] = useState('');
  const [manualEmailUser, setManualEmailUser] = useState('');
  const [manualPasswordUser, setManualPasswordUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8); // Genera una contraseña aleatoria de 8 caracteres
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data } = await axios.get(`${backUrl}/users`);
        setUsers(data);
      } catch (error) {
        console.log("Error cargando los usuarios", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const { data } = await axios.get(`${backUrl}/characters`);
        setCharacters(data);
      } catch (error) {
        console.log("Error cargando los personajes", error);
      }
    }
    fetchCharacters();
  }, []);

  useEffect(() => {
    if (session && session.user) {
      const newUser = {
        name_user: session.user.name,
        email_user: session.user.email,
        password_user: generateRandomPassword()
      };
      addUserToDatabase(newUser);
      setIsLoggedIn(true);
    }
  }, [session]);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const addUserToDatabase = async (user) => {
    try {
      // Verificar si el usuario ya existe
      const existingUser = users.find(u => u.email_user === user.email_user);
      if (existingUser) {
        console.log('El usuario ya existe en la base de datos.');
        return;
      }

      // Agregar usuario
      const response = await axios.post(`${backUrl}/users`, user);
      console.log('Usuario añadido correctamente:', response.data);
      setUsers([...users, response.data]);
      setIsLoggedIn(true);
      setLoggedInUser(response.data);
      localStorage.setItem('loggedInUser', JSON.stringify(response.data));
    } catch (error) {
      console.log('Error al añadir usuario:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const user = {
      name_user: nameUser,
      email_user: emailUser,
      password_user: passwordUser,
    };
    await addUserToDatabase(user);
  };

  const handleLogin = async () => {
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.log('Error al iniciar sesión:', error);
    }
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const user = users.find(u => u.email_user === manualEmailUser && u.password_user === manualPasswordUser);
      if (user) {
        setIsLoggedIn(true);
        setLoggedInUser(user);
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        console.log('Inicio de sesión exitoso:', user);
      } else {
        console.log('Correo o contraseña incorrectos.');
      }
    } catch (error) {
      console.log('Error al iniciar sesión manualmente:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
    signOut();
  };

  if (loading) {
    return <p className='text-2xl font-bold text-center'>Cargando usuarios...</p>
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between ${jersey_10.className}`}>
      <div className="bg-black text-white w-full h-screen flex flex-col justify-center">
        <StarAnimation />
        <img
          src="/img_inicio.jpeg"
          alt="Inicio"
          layout="fill"
          className="absolute object-cover w-full h-screen opacity-30 z-0"
        />

        {isLoggedIn ? (
          <div className="relative container w-full h-screen flex flex-col items-center justify-center">
            <div className="container w-9/12 h-1/3 p-5 m-2 flex items-center justify-center border-8 border-white border-double bg-black bg-opacity-60">
              <h1 className='text-8xl text-center'>
                Welcome to The Cavern
              </h1>
            </div>

            <div className="container w-1/2 h-auto m-2 flex items-center justify-center">
              <Link
                href="/landing"
                className="group relative w-9/12 h-auto p-2 border-4 border-double border-yellow-700 rounded-xl bg-black bg-opacity-60 hover:scale-90
                transform transition duration-500 ease-in-out overflow-hidden animate-pulse hover:animate-none">
                <span
                  className="relative z-10 w-full h-full text-4xl text-white text-center
                  group-hover:text-black flex items-center justify-center transition duration-500 ease-in-out">
                  Start your adventure!!
                </span>
                <span className="absolute top-0 left-0 w-full h-full bg-yellow-400 bg-opacity-60 
                transform translate-y-full group-hover:translate-y-0 transition duration-500 ease-in-out">
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="items-center justify-center w-full h-screen flex flex-col z-10">
            <div className="container flex flex-col items-center justify-center w-8/12 h-auto bg-gray-600 bg-opacity-60 p-4 m-4
            border-4 border-purple-800 rounded-xl gap-1">
              <h1 className='text-5xl text-white text-center'>
                Welcome To The Cavern!!
              </h1>
              <div className='flex w-full h-auto gap-5'>
                <form onSubmit={handleAddUser} className='w-1/2 p-4'>
                  <div className='w-11/12'>
                    <label className="block text-white text text-3xl mb-2" htmlFor='nameUser'>
                      User Name
                    </label>
                    <input
                      type='text'
                      id='nameUser'
                      value={nameUser}
                      onChange={(e) => setNameUser(e.target.value)}
                      className='appearance-none border-4 border-cyan-950 rounded-lg w-full p-1 px-3 text-black text-2xl leading-tight
                    hover:shadow-purple-500 hover:shadow-sm focus:shadow-purple-500 focus:shadow-md hover:border-purple-800 
                    focus:border-purple-800 transition-all ease-out duration-500'
                    />
                  </div>
                  <div className='w-11/12'>
                    <label className="block text-white text text-3xl mb-2" htmlFor='emailUser'>
                      Correo
                    </label>
                    <input
                      type='email'
                      id='emailUser'
                      value={emailUser}
                      onChange={(e) => setEmailUser(e.target.value)}
                      className='appearance-none border-4 border-cyan-950 rounded-lg w-full p-1 px-3 text-black text-2xl leading-tight
                    hover:shadow-purple-500 hover:shadow-sm focus:shadow-purple-500 focus:shadow-md hover:border-purple-800 
                    focus:border-purple-800 transition-all ease-out duration-500'                  />
                  </div>
                  <div className='w-11/12'>
                    <label className="block text-white text text-3xl mb-2" htmlFor='passwordUser'>
                      Contraseña
                    </label>
                    <input
                      type='password'
                      id='passwordUser'
                      value={passwordUser}
                      onChange={(e) => setPasswordUser(e.target.value)}
                      className='appearance-none border-4 border-cyan-950 rounded-lg w-full p-1 px-3 text-black text-2xl leading-tight
                    hover:shadow-purple-500 hover:shadow-sm focus:shadow-purple-500 focus:shadow-md hover:border-purple-800 
                    focus:border-purple-800 transition-all ease-out duration-500'                  />
                  </div>
                  <div className='flex items-center justify-end w-11/12'>
                    <button
                      type='submit'
                      className='w-6/12 bg-white border-4 border-gray-900 hover:bg-purple-500 text-black text-2xl px-4 py-1 rounded-lg mt-4
                    transition-all ease-out duration-500 right-0'
                    >
                      Registrate
                    </button>
                  </div>
                </form>

                <form onSubmit={handleManualLogin} className='w-1/2 p-4'>
                  <div className='w-11/12'>
                    <label className="block text-white text text-3xl mb-2" htmlFor='IniciarEmailUser'>
                      Correo
                    </label>
                    <input
                      type='email'
                      id='IniciarEmailUser'
                      value={manualEmailUser}
                      onChange={(e) => setManualEmailUser(e.target.value)}
                      className='appearance-none border-4 border-cyan-950 rounded-lg w-full p-1 px-3 text-black text-2xl leading-tight
                    hover:shadow-purple-500 hover:shadow-sm focus:shadow-purple-500 focus:shadow-md hover:border-purple-800 
                    focus:border-purple-800 transition-all ease-out duration-500'                  />
                  </div>
                  <div className='w-11/12'>
                    <label className="block text-white text text-3xl mb-2" htmlFor='iniciarPasswordUser'>
                      Contraseña
                    </label>
                    <input
                      type='password'
                      id='iniciarPasswordUser'
                      value={manualPasswordUser}
                      onChange={(e) => setManualPasswordUser(e.target.value)}
                      className='appearance-none border-4 border-cyan-950 rounded-lg w-full p-1 px-3 text-black text-2xl leading-tight
                    hover:shadow-purple-500 hover:shadow-sm focus:shadow-purple-500 focus:shadow-md hover:border-purple-800 
                    focus:border-purple-800 transition-all ease-out duration-500'                  />
                  </div>
                  <div className='flex items-center justify-end w-11/12'>
                    <button
                      type='submit'
                      className='w-6/12 bg-white border-4 border-gray-900 hover:bg-teal-500 text-black text-2xl px-4 py-1 rounded-lg mt-4
                    transition-all ease-out duration-500 right-0'                  >
                      Iniciar sesión
                    </button>
                  </div>
                </form>

              </div>

              <button onClick={handleLogin}
                className='appearance-none w-10/12 border-4 border-yellow-900 rounded-lg p-4 px-3 text-white text-4xl bg-black bg-opacity-60
                hover:bg-amber-800 hover:text-black hover:shadow-purple-500 hover:shadow-sm hover:border-black transition-all ease-out 
                duration-500'>
                  Iniciar sesión con Google
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}