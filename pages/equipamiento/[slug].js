import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import StarAnimation from "@/components/common/StartAnimation";

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
    <div className="bg-black w-full flex flex-col items-center gap-4 h-screen px-4 py-8 sm:p-10 overflow-y-auto">
      <img
        src="/Fondo_Biblioteca.jpeg"
        alt="Fondo bienvenida"
        className="fixed top-0 left-0 w-full h-full object-cover opacity-15 z-0"
      />
      <div className="w-full h-auto flex justify-center mb-5">
        <Header />
      </div>
      <div className="fixed w-full h-screen z-10 opacity-40">
        <StarAnimation />
      </div>
      <div className="container flex flex-col items-center z-10">
      <h2 className="text-center text-white text-2xl sm:text-4xl font-['Press_Start_2P'] mb-5 z-30">
        {equipo.name}
      </h2>

      <div className="container w-full sm:w-11/12 h-auto bg-gray-800 bg-opacity-80 rounded-xl z-20 p-4 sm:p-6">
        <p className="text-lg text-white sm:text-2xl text-center col-span-2">
          {equipo.desc}
        </p>
        <div className="container grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6 w-full h-auto text-justify">
          <div>
            <p className="text-lg text-white sm:text-2xl">
              <strong>Category:</strong>
              <ul className="flex flex-col list-disc pl-5 text-white">
                <li>{equipo.equipment_category.name}</li>
              </ul>
            </p>
          </div>
          <div>
            <p className="text-lg sm:text-2xl text-white">
              <strong>Equipament Category:</strong>
              <ul className="flex flex-col list-disc pl-5 text-white">
                <li>{equipo.equipment_category.name}</li>
              </ul>
            </p>
          </div>

          <div>
            <p className="text-lg sm:text-2xl text-white">
              <strong>Cost:</strong>
              <ul className="flex flex-col list-disc pl-5 text-white">
                <li>
                  {equipo.cost.quantity} {equipo.cost.unit}
                </li>
              </ul>
            </p>
          </div>
          <div>
            <p className="text-lg sm:text-2xl text-white">
              <strong>Weight:</strong>
              <ul className="flex flex-col list-disc pl-5 text-white">
                <li>{equipo.weight} lbs</li>
              </ul>
            </p>
          </div>
      
        </div>
      </div>
      </div>
    </div>
  );
}
