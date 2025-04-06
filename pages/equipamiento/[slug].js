import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import StarAnimation from "@/components/common/StartAnimation";
import { Jersey_10 } from '@next/font/google';

const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });

export default function EquipamientoDetalles() {
  const router = useRouter();
  const { slug } = router.query;
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      axios
        .get(`https://www.dnd5eapi.co/api/equipment/${slug}`)
        .then((res) => {
          setEquipo(res.data); // Guardamos los datos en el estado
          setLoading(false); // Quitamos el estado de carga
        })
        .catch((error) => {
          console.error("Error al obtener el equipo:", error);
          setError(error);
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h2 className="text-3xl sm:text-5xl font-['Press_Start_2P']">Cargando...</h2>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h2 className="text-3xl sm:text-5xl font-['Press_Start_2P']">
          Error al cargar el equipo
        </h2>
      </div>
    );
  }
  if (!equipo) return null;

  return (
    <main className={`bg-black text-white w-full min-h-screen flex flex-col items-center justify-start bg-fixed overflow-y-auto ${jersey_10.className}`}>
      <img
        src="/Fondo_Biblioteca.jpeg"
        alt="Fondo bienvenida"
        className="fixed top-0 left-0 w-full h-full object-cover opacity-30 z-0"
      />
      <div className="w-11/12 h-auto flex justify-center my-5 z-50">
      <Header />
      </div>
      <div className="fixed w-full h-screen z-10 opacity-40">
        <StarAnimation />
      </div>
      <div className="container flex flex-col items-center z-10">
      <h2 className="text-center text-white text-2xl sm:text-6xl mb-5 z-30">
        {equipo.name}
      </h2>

      <div className="container w-full sm:w-11/12 h-auto bg-gray-800 bg-opacity-80 rounded-xl z-20 p-4 sm:p-6">
        <p className="text-lg text-white sm:text-2xl text-center col-span-2">
          {equipo.desc}
        </p>
        <div className="container grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6 w-full h-auto text-justify">
          <div>
            <p className="text-lg text-white sm:text-4xl">
              Category:
              <ul className="flex flex-col list-disc pl-5 text-white">
                <li className="text-2xl">{equipo.equipment_category.name}</li>
              </ul>
            </p>
          </div>
          <div>
            <p className="text-lg sm:text-4xl text-white">
              Equipament Category:
              <ul className="flex flex-col list-disc pl-5 text-white">
                <li className="text-2xl">{equipo.equipment_category.name}</li>
              </ul>
            </p>
          </div>

          <div>
            <p className="text-lg sm:text-4xl text-white">
              Cost:
              <ul className="flex flex-col list-disc pl-5 text-white">
                <li className="text-2xl">
                  {equipo.cost.quantity} {equipo.cost.unit}
                </li>
              </ul>
            </p>
          </div>
          <div>
            <p className="text-lg sm:text-4xl text-white">
              Weight:
              <ul className="flex flex-col list-disc pl-5 text-white">
                <li className="text-2xl">{equipo.weight} lbs</li>
              </ul>
            </p>
          </div>
      
        </div>
      </div>
      </div>
    </main>
  );
}
