import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StarAnimation from "@/components/common/StartAnimation";
import Header from "@/components/common/Header";

export default function ReglasDetalles() {
  const router = useRouter();
  const { slug } = router.query;
  const [regla, setRegla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      axios
        .get(`https://www.dnd5eapi.co/api/rule-sections/${slug}`)
        .then((res) => {
          setRegla(res.data); // Guardamos los datos en el estado
          setLoading(false); // Quitamos el estado de carga
        })
        .catch((error) => {
          console.error("Error al obtener ls regla:", error);
          setError(error);
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h2 className="text-2xl md:text-5xl font-['Press_Start_2P'] text-white">Cargando...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h2 className="text-2xl text-white md:text-5xl font-['Press_Start_2P']">
          Error al cargar la regla
        </h2>
      </div>
    );
  }

  if (!regla) return null;

  return (
    <div className="w-full p-4 md:p-10 flex flex-col items-center bg-black bg-opacity-25">
      <div className="w-full h-auto flex justify-center mb-5">
        <Header />
      </div>
      <div className="fixed w-full h-screen z-10 opacity-40">
        <StarAnimation />
      </div>
      <img
        src="/Fondo_Biblioteca.jpeg"
        alt="Fondo bienvenida"
        className="fixed top-0 left-0 w-full h-full object-cover opacity-15 z-10"
      />
      <h2 className="text-center text-white text-2xl md:text-4xl font-['Press_Start_2P'] mb-5 z-20">
        {regla.name}
      </h2>
      <div className="container flex flex-col md:flex-row w-full md:w-10/12 h-auto gap-4 justify-center">
        <div className="container flex flex-col p-4 md:p-6 w-full h-auto text-justify bg-gray-800 bg-opacity-100 rounded-xl gap-2 z-20">
          <p className="text-xl text-white md:text:xl">{regla.desc}</p>
        </div>
      </div>
    </div>
  );
}
