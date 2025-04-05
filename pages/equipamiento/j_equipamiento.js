import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/common/Header";
import StarAnimation from "@/components/common/StartAnimation";

export default function Hechizos() {
  const router = useRouter();
  const [equipo, setEquipo] = useState([]);

  useEffect(() => {
    const fetchEquipamiento = async () => {
      try {
        const response = await fetch("https://www.dnd5eapi.co/api/equipment");
        const data = await response.json();
        const formattedEquipamiento = data.results.map((equipItem, index) => ({
          id: index + 1,
          title: equipItem.name,
          description: `Descubre los secretos de ${equipItem.name} y vuelvete mas fuerte`,
          link: `/equipamiento/${equipItem.index}`,
        }));
        setEquipo(formattedEquipamiento);
      } catch (error) {
        console.error("Error fetching equipamiento:", error);
      }
    };

    fetchEquipamiento();
  }, []);

  const handleEquipoClick = (index) => {
    router.push(`/equipamiento/${index}`);
  };

  return (
    <div className="flex flex-col items-center w-full h-full bg-black p-4 sm:p-10 sm:px-32">
      <div className="w-full h-auto flex justify-center mb-5">
        <Header />
      </div>
      <div className="fixed w-full h-screen z-10 opacity-40">
        <StarAnimation />
      </div>
      <img
        src="/Fondo_Biblioteca.jpeg"
        alt="Fondo bienvenida"
        className="fixed top-0 left-0 w-full h-full object-cover opacity-15 z-0"
      />
      <div
        className="container flex flex-col items-center gap-3 w-full sm:w-10/12 h-auto border-solid border-white border-b-2 border-t-2 p-5 
                animate-fade-in-down z-20"
        style={{
          boxShadow:
            "0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 -10px 15px -3px rgba(255, 255, 255, 0.1)",
          fontFamily: "'Press Start 2P', cursive",
        }}
      >
        <h1 className="text-center text-2xl sm:text-4xl w-full text-white">Equipamentos D&D</h1>
        <h2 className="text-lg sm:text-xl text-center text-cyan-400">
          Elige tus herramientas
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mt-12 w-full z-20">
        {equipo.map((equipItem) => (
          <div key={equipItem.id} className="flex justify-center">
            <button
              onClick={() => handleEquipoClick(equipItem.link.split("/").pop())}
              className="w-full h-32 px-2 py-2 sm:px-5 sm:py-2.5 mt-2 relative group overflow-hidden font-medium
                            bg-slate-700 bg-opacity-70 text-white inline-block transition-all duration-500
                            rounded-lg shadow-md shadow-white
                            ease-out transform hover:scale-105"
            >
              <div className="absolute inset-0 flex flex-col justify-center items-center transition-all duration-500 transform group-hover:-translate-y-full">
                <h3
                  className="text-lg sm:text-2xl"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                  }}
                >
                  {equipItem.title}
                </h3>
              </div>
              <div
                className="absolute inset-0 flex flex-col justify-center items-center transition-all duration-500 
                            transform translate-y-full group-hover:translate-y-0"
              >
                <span className="w-full h-full absolute opacity-90"></span>
                <p
                  className="relative bg-white bg-opacity-80 rounded-lg m-2 sm:m-6 p-2 sm:p-4 
                                    text-center text-xs sm:text-sm text-black font-['Press_Start_2P']"
                >
                  {equipItem.description}
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
