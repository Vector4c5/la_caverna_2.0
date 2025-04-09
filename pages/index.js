import { Jersey_10 } from '@next/font/google';
import StarAnimation from "@/components/common/StartAnimation";
import Link from "next/link";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSession, signIn, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';

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
        toast.success(`¡Bienvenido ${user.user_name || user.name_user}!`, {
          icon: "👋"
        });
      } else {
        console.log('Correo incorrecto.');
        toast.error('Correo no registrado. Por favor verifica tus datos.', {
          icon: "🔒"
        });
      }
    } catch (error) {
      console.log('Error al iniciar sesión manualmente:', error);
      toast.error('Error al iniciar sesión. Intenta nuevamente.', {
        icon: "⚠️"
      });
    }
  };

  const handleManualRegister = async (e) => {
    e.preventDefault();
    const newUser = {
      user_name: manualNameUser,
      email_user: registerEmailUser,
    };

    try {
      const existingUser = users.find(u => u.email_user === newUser.email_user);
      if (existingUser) {
        toast.warning('El usuario ya está registrado.', {
          position: "top-center",
          icon: "🚫"
        });
        return;
      }

      const response = await axios.post(`${backUrl}/users_cavern`, newUser);
      console.log('Usuario registrado correctamente:', response.data);
      setUsers([...users, response.data]);
      
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.', {
        position: "top-center",
        icon: "🎉"
      });
      
      setManualNameUser('');
      setRegisterEmailUser('');
      
    } catch (error) {
      console.log('Error al registrar usuario:', error);
      
      toast.error('Hubo un error al registrar el usuario.', {
        position: "top-center",
        icon: "❌"
      });
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
        <div className="relative bg-black text-white w-full min-h-screen flex flex-col justify-center">
          <StarAnimation />
          <div className="fixed inset-0 z-0 w-full h-full">
            <img
              src="/img_inicio.jpeg"
              alt="Inicio"
              className="w-full h-full object-cover opacity-30"
            />
          </div>
          <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-6">
            <div className="container flex flex-col items-center justify-center w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12 h-auto 
                        bg-gray-600 bg-opacity-60 p-3 sm:p-4 md:p-6
                          border-2 sm:border-3 md:border-4 border-purple-800 rounded-xl gap-2 sm:gap-3 md:gap-4">
              
              {/* Title - responsive */}
              <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white text-center mb-2 sm:mb-4'>
                Welcome To The Cavern!!
              </h1>
              
              {/* Container for forms and right side - switches to column on mobile */}
              <div className='flex flex-col md:flex-row items-center w-full h-auto p-2 gap-4'>
                
                {/* Left side - forms container */}
                <div className='flex flex-col items-center justify-center w-full md:w-1/2 p-2 sm:p-3 md:p-4'>
                  
                  {/* Login form */}
                  <form onSubmit={handleManualLogin} className='w-full mb-4 sm:mb-6'>
                    <div className='w-full'>
                      <label className="block text-white text-lg sm:text-xl md:text-2xl lg:text-3xl mb-1 sm:mb-2" htmlFor='IniciarEmailUser'>
                        Email
                      </label>
                      <input
                        type='email'
                        id='IniciarEmailUser'
                        value={loginEmailUser}
                        onChange={(e) => setLoginEmailUser(e.target.value)}
                        className='appearance-none border-2 sm:border-3 md:border-4 border-cyan-950 rounded-lg w-full 
                                  p-1 px-2 sm:p-2 sm:px-3 text-black text-base sm:text-lg md:text-xl lg:text-2xl leading-tight
                                hover:shadow-purple-500 hover:shadow-sm focus:shadow-purple-500 focus:shadow-md hover:border-purple-800 
                                focus:border-purple-800 transition-all ease-out duration-500'
                      />
                    </div>
                    <div className='flex items-center justify-end w-full mt-2 sm:mt-3'>
                      <button
                        type='submit'
                        className='w-full sm:w-8/12 md:w-6/12 bg-white border-2 sm:border-3 md:border-4 border-gray-900 
                                hover:bg-teal-500 text-black text-base sm:text-lg md:text-xl lg:text-2xl 
                                px-3 py-1 sm:px-4 sm:py-1 rounded-lg mt-2 sm:mt-3 md:mt-4
                                transition-all ease-out duration-500 right-0'>
                        Iniciar sesión
                      </button>
                    </div>
                  </form>

                  {/* Registration form */}
                  <form onSubmit={handleManualRegister} className='w-full h-auto'>
                    <div className='w-full mb-2 sm:mb-3'>
                      <label className="block text-white text-lg sm:text-xl md:text-2xl lg:text-3xl mb-1 sm:mb-2" htmlFor='RegisterNameUser'>
                        Nombre
                      </label>
                      <input
                        type='text'
                        id='RegisterNameUser'
                        value={manualNameUser}
                        onChange={(e) => setManualNameUser(e.target.value)}
                        className='appearance-none border-2 sm:border-3 md:border-4 border-cyan-950 rounded-lg w-full 
                                  p-1 px-2 sm:p-2 sm:px-3 text-black text-base sm:text-lg md:text-xl lg:text-2xl leading-tight
                                hover:shadow-purple-500 hover:shadow-sm focus:shadow-purple-500 focus:shadow-md hover:border-purple-800 
                                focus:border-purple-800 transition-all ease-out duration-500'
                      />
                    </div>
                    <div className='w-full mb-2 sm:mb-3'>
                      <label className="block text-white text-lg sm:text-xl md:text-2xl lg:text-3xl mb-1 sm:mb-2" htmlFor='RegisterEmailUser'>
                        Email
                      </label>
                      <input
                        type='email'
                        id='RegisterEmailUser'
                        value={registerEmailUser}
                        onChange={(e) => setRegisterEmailUser(e.target.value)}
                        className='appearance-none border-2 sm:border-3 md:border-4 border-cyan-950 rounded-lg w-full 
                                  p-1 px-2 sm:p-2 sm:px-3 text-black text-base sm:text-lg md:text-xl lg:text-2xl leading-tight
                                hover:shadow-purple-500 hover:shadow-sm focus:shadow-purple-500 focus:shadow-md hover:border-purple-800 
                                focus:border-purple-800 transition-all ease-out duration-500'
                      />
                    </div>
                    <div className='flex items-center justify-end w-full mt-2 sm:mt-3'>
                      <button
                        type='submit'
                        className='w-full sm:w-8/12 md:w-6/12 bg-white border-2 sm:border-3 md:border-4 border-gray-900 
                                hover:bg-teal-500 text-black text-base sm:text-lg md:text-xl lg:text-2xl 
                                px-3 py-1 sm:px-4 sm:py-1 rounded-lg mt-2 sm:mt-3 md:mt-4
                                transition-all ease-out duration-500 right-0'>
                        Registrarse
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right side - logo and buttons */}
                <div className='flex flex-col items-center justify-center w-full md:w-1/2 p-2 gap-3 sm:gap-4 md:gap-5'>
                  {/* Logo container */}
                  <div className="relative w-10/12 sm:w-9/12 md:w-8/12 aspect-square mb-2">
                    <img
                      src="/Logo_The_Cavern.jpeg"
                      alt="Logo"
                      className="w-full h-full object-cover border-2 sm:border-3 md:border-4 border-white rounded-full shadow-lg shadow-gray-500"
                    />
                  </div>
                  
                  {/* Discord button */}
                  <Link
                    href="https://discord.gg/YzqMRypkYz"
                    className='appearance-none w-full sm:w-10/12 border-2 sm:border-3 md:border-4 border-pink-500 rounded-lg 
                            p-1 px-2 sm:p-2 sm:px-3 text-white text-base sm:text-lg md:text-2xl lg:text-3xl text-center 
                          bg-black bg-opacity-60 hover:bg-pink-300 hover:text-black hover:shadow-pink-300 hover:shadow-lg hover:scale-105 
                            transition-all ease-out duration-400'>
                    Join our Discord community
                  </Link>
                  
                  {/* Google sign-in button */}
                  <button onClick={() => signIn()}
                    className='appearance-none w-full sm:w-10/12 border-2 sm:border-3 md:border-4 border-teal-600 rounded-lg 
                            p-2 px-3 text-white text-base sm:text-xl md:text-2xl lg:text-4xl bg-black bg-opacity-60
                          hover:bg-teal-300 hover:text-black hover:shadow-teal-300 hover:shadow-lg hover:scale-105 transition-all ease-out 
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
      <div className="relative bg-black text-white w-full min-h-screen flex flex-col justify-center">
        <StarAnimation />
        <div className="fixed inset-0 z-0 w-full h-full">
          <img
            src="/img_inicio.jpeg"
            alt="Inicio"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-6">
          {/* Title container - responsive for all screen sizes */}
          <div className="w-full md:w-10/12 lg:w-9/12 p-3 sm:p-4 md:p-5 my-2 flex items-center justify-center 
                        border-4 sm:border-6 md:border-8 border-white border-double bg-black bg-opacity-60">
            <h1 className='text-3xl sm:text-5xl md:text-6xl lg:text-8xl text-center'>
              Welcome to The Cavern
            </h1>
          </div>

          {/* Start Adventure button - responsive for all screen sizes */}
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-auto my-4 flex items-center justify-center">
            <Link
              href="/landing"
              className="group relative w-full sm:w-10/12 md:w-9/12 h-auto p-2 border-2 sm:border-3 md:border-4 
                      border-double border-yellow-700 rounded-xl bg-black bg-opacity-60 hover:scale-95
                      transform transition duration-500 ease-in-out overflow-hidden animate-pulse hover:animate-none"
            >
              <span
                className="relative z-10 w-full h-full text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white text-center
                        group-hover:text-black flex items-center justify-center py-2 md:py-3 transition duration-500 ease-in-out"
              >
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