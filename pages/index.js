import { Jersey_10 } from '@next/font/google';
import StarAnimation from "@/components/common/StartAnimation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSession, signIn, signOut } from 'next-auth/react';

const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });
const backUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loginEmailUser, setLoginEmailUser] = useState(''); // Estado para el correo del inicio de sesión
  const [registerEmailUser, setRegisterEmailUser] = useState(''); // Estado para el correo del registro
  const [manualNameUser, setManualNameUser] = useState(''); // Estado para el nombre del registro
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data } = await axios.get(`${backUrl}/users_cavern`);
        setUsers(data);
      } catch (error) {
        console.log("Error cargando los usuarios", error);
      }
    }
    fetchUsers();
  }, []);

  const addUserToDatabase = useCallback(async (user) => {
    try {
      const existingUser = users.find(u => u.email_user === user.email_user);
      if (existingUser) {
        console.log('El usuario ya existe en la base de datos.');
        return;
      }

      const response = await axios.post(`${backUrl}/users_cavern`, user);
      console.log('Usuario añadido correctamente:', response.data);
      setUsers([...users, response.data]);
      setIsLoggedIn(true);
      setLoggedInUser(response.data);
      localStorage.setItem('loggedInUser', JSON.stringify(response.data));
    } catch (error) {
      console.log('Error al añadir usuario:', error);
    }
  }, [users]);

  useEffect(() => {
    if (session && session.user) {
      const newUser = {
        user_name: session.user.name,
        email_user: session.user.email,
      };
      addUserToDatabase(newUser);
      setIsLoggedIn(true);
    }
  }, [session, addUserToDatabase]);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const user = users.find(u => u.email_user === loginEmailUser);
      if (user) {
        setIsLoggedIn(true);
        setLoggedInUser(user);
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        console.log('Inicio de sesión exitoso:', user);
      } else {
        console.log('Correo incorrecto.');
      }
    } catch (error) {
      console.log('Error al iniciar sesión manualmente:', error);
    }
  };

  const handleManualRegister = async (e) => {
    e.preventDefault();
    const newUser = {
      user_name: manualNameUser, // Cambiado a "user_name" para coincidir con el backend
      email_user: registerEmailUser,
    };

    try {
      const existingUser = users.find(u => u.email_user === newUser.email_user);
      if (existingUser) {
        alert('El usuario ya está registrado.');
        return;
      }

      const response = await axios.post(`${backUrl}/users_cavern`, newUser); // Enviando los datos correctos
      console.log('Usuario registrado correctamente:', response.data);
      setUsers([...users, response.data]);
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
    } catch (error) {
      console.log('Error al registrar usuario:', error);
      alert('Hubo un error al registrar el usuario.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
    signOut();
  };

  if (!isLoggedIn) {
    return (
      <main className={`flex min-h-screen flex-col items-center justify-between ${jersey_10.className}`}>
        <div className="relative bg-black text-white w-full h-screen flex flex-col justify-center">
          <StarAnimation />
            <img
              src="/img_inicio.jpeg"
              alt="Inicio"
              className="absolute w-full h-full object-cover opacity-30"
            />
          <div className="items-center justify-center w-full h-screen flex flex-col z-10">
            <div className="container flex flex-col items-center justify-center w-8/12 h-auto bg-gray-600 bg-opacity-60 p-4 m-4
            border-4 border-purple-800 rounded-xl gap-1">
              <h1 className='text-5xl text-white text-center'>
                Welcome To The Cavern!!
              </h1>
              <div className='flex items-center w-full h-auto p-2'>
                <div className='flex flex-col items-center justify-center w-1/2 p-4'>
                  {/* Formulario de inicio de sesión manual */}
                  <form onSubmit={handleManualLogin} className='w-full'>
                    <div className='w-11/12'>
                      <label className="block text-white text text-3xl mb-2" htmlFor='IniciarEmailUser'>
                        Email
                      </label>
                      <input
                        type='email'
                        id='IniciarEmailUser'
                        value={loginEmailUser} // Usa el estado específico para el inicio de sesión
                        onChange={(e) => setLoginEmailUser(e.target.value)} // Actualiza el estado específico
                        className='appearance-none border-4 border-cyan-950 rounded-lg w-full p-1 px-3 text-black text-2xl leading-tight
                        hover:shadow-purple-500 hover:shadow-sm focus:shadow-purple-500 focus:shadow-md hover:border-purple-800 
                        focus:border-purple-800 transition-all ease-out duration-500'
                      />
                    </div>
                    <div className='flex items-center justify-end w-11/12'>
                      <button
                        type='submit'
                        className='w-6/12 bg-white border-4 border-gray-900 hover:bg-teal-500 text-black text-2xl px-4 py-1 rounded-lg mt-4
                        transition-all ease-out duration-500 right-0'>
                        Iniciar sesión
                      </button>
                    </div>
                  </form>

                  {/* Formulario de registro manual */}
                  <form onSubmit={handleManualRegister} className='w-full h-auto'>
                    <div className='w-11/12'>
                      <label className="block text-white text text-3xl mb-2" htmlFor='RegisterNameUser'>
                        Nombre
                      </label>
                      <input
                        type='text'
                        id='RegisterNameUser'
                        value={manualNameUser} // Usa el estado específico para el nombre
                        onChange={(e) => setManualNameUser(e.target.value)} // Actualiza el estado específico
                        className='appearance-none border-4 border-cyan-950 rounded-lg w-full p-1 px-3 text-black text-2xl leading-tight
                        hover:shadow-purple-500 hover:shadow-sm focus:shadow-purple-500 focus:shadow-md hover:border-purple-800 
                        focus:border-purple-800 transition-all ease-out duration-500'
                      />
                    </div>
                    <div className='w-11/12'>
                      <label className="block text-white text text-3xl mb-2" htmlFor='RegisterEmailUser'>
                        Email
                      </label>
                      <input
                        type='email'
                        id='RegisterEmailUser'
                        value={registerEmailUser} // Usa el estado específico para el registro
                        onChange={(e) => setRegisterEmailUser(e.target.value)} // Actualiza el estado específico
                        className='appearance-none border-4 border-cyan-950 rounded-lg w-full p-1 px-3 text-black text-2xl leading-tight
                        hover:shadow-purple-500 hover:shadow-sm focus:shadow-purple-500 focus:shadow-md hover:border-purple-800 
                        focus:border-purple-800 transition-all ease-out duration-500'
                      />
                    </div>
                    <div className='flex items-center justify-end w-11/12'>
                      <button
                        type='submit'
                        className='w-6/12 bg-white border-4 border-gray-900 hover:bg-teal-500 text-black text-2xl px-4 py-1 rounded-lg mt-4
                        transition-all ease-out duration-500 right-0'>
                        Registrarse
                      </button>
                    </div>
                  </form>
                </div>

                <div className='flex flex-col items-center justify-center w-1/2 h-auto p-2 gap-4'>
                  <div className="relative w-8/12 h-auto">
                    <img
                      src="/Logo_The_Cavern.jpeg"
                      alt="Logo"
                      layout="fill"
                      objectFit="contain"
                      className="border-4 border-white rounded-full shadow-lg shadow-gray-500"
                    />
                  </div>
                  <Link
                    href="https://discord.gg/YzqMRypkYz"
                    className='appearance-none w-10/12 h-auto border-4 border-pink-500 rounded-lg p-1 px-3 text-white text-3xl text-center 
                    bg-black bg-opacity-60 hover:bg-pink-300 hover:text-black hover:shadow-pink-300 hover:shadow-lg hover:scale-110 
                    transition-all ease-out duration-400'>
                    Join our Discord community
                  </Link>
                  <button onClick={() => signIn()}
                    className='appearance-none w-10/12 border-4 border-teal-600 rounded-lg p-2 px-3 text-white text-4xl bg-black bg-opacity-60
                    hover:bg-teal-300 hover:text-black hover:shadow-teal-300 hover:shadow-lg hover:scale-110 transition-all ease-out 
                    duration-400'>
                    Sign in with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between ${jersey_10.className}`}>
        <div className="relative bg-black text-white w-full h-screen flex flex-col justify-center">
        <StarAnimation />
        <div className="fixed inset-0 z-0 w-full h-full">
        <img
              src="/img_inicio.jpeg"
              alt="Inicio"
              className="absolute w-full h-full object-cover opacity-30"
            />
        </div>
        <div className="relative w-full h-screen flex flex-col items-center justify-center">
          <div className="w-9/12 h-1/3 p-5 m-2 flex items-center justify-center border-8 border-white border-double bg-black bg-opacity-60">
            <h1 className='text-8xl text-center'>
              Welcome to The Cavern
            </h1>
          </div>
          <div className="w-1/2 h-auto m-2 flex items-center justify-center">
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
      </div>
    </main>
  );
}