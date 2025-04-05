import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/common/Header";
import StarAnimation from "@/components/common/StartAnimation";

export default function ClaseDetalle() {
  const router = useRouter();
  const { slug } = router.query;
  const [claseData, setClaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaseData = async () => {
      if (!slug) return;

      try {
        const response = await fetch(
          `https://www.dnd5eapi.co/api/classes/${slug}`
        );
        const data = await response.json();
        setClaseData(data);
      } catch (error) {
        console.error("Error fetching class data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaseData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <h2
          className="text-4xl text-white"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Loading...
        </h2>
      </div>
    );
  }

  if (!claseData) return null;

  return (
    <div className="relative container bg-black  mx-auto px-4 py-8">
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
      <div className="relative z-10">
        <h1
          className="text-4xl mb-6 text-center text-white"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          {claseData.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Information */}
          <div className="bg-slate-700 bg-opacity-80 p-6 rounded-lg shadow-md">
            <h2
              className="text-2xl text-center mb-4 text-white "
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              Features
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-white">Hit Die: d{claseData.hit_die}</p>
            </div>

            <ul className="list-disc list-inside my-4 text-white">
              When you start with this class, you must...
              {claseData.proficiency_choices.map((desc) => (
                <li key={desc.desc} className="text-white">{desc.desc}</li>
              ))}
            </ul>
            <h3 className="text-xl mb-2 text-white">Proficiencies:</h3>
            <ul className="list-disc list-inside text-white">
              {claseData.proficiencies.map((prof) => (
                <li key={prof.index} className="text-white">{prof.name}</li>
              ))}
            </ul>
          </div>

          {/* Starting Equipment */}
          <div className="bg-slate-700 bg-opacity-80 p-6 rounded-lg shadow-md">
            <h2
              className="text-2xl text-center mb-4 text-white"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              Starting Equipment
            </h2>
            <ul className="list-disc list-inside">
              {claseData.starting_equipment.map((equip, index) => (
                <li key={index} className="text-white">
                  {equip.equipment.name} x {equip.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
