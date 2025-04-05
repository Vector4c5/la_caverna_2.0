import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/common/Header";
import StarAnimation from "@/components/common/StartAnimation";
import { Jersey_10 } from '@next/font/google';

const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });

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
    <main className={`bg-black text-white w-full min-h-screen flex flex-col items-center justify-start bg-fixed overflow-y-auto ${jersey_10.className}`}>
      <div className="w-11/12 h-auto flex justify-center my-5 z-50">
            <Header />
        </div>
        <div className="fixed w-full h-screen z-10 opacity-40">
            <StarAnimation />
        </div>
      <img
            src="/Fondo_Biblioteca.jpeg"
            alt="Fondo bienvenida"
            className="fixed top-0 left-0 w-full h-full object-cover opacity-30 z-0"
        />
      <div className="relative z-10 w-10/12 my-4">
        <h1
          className="text-6xl mb-6 text-center text-white"
        >
          {claseData.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Information */}
          <div className="bg-slate-700 bg-opacity-80 p-6 rounded-lg shadow-md">
            <h2
              className="text-4xl text-center mb-4 text-white "            >
              Features
            </h2>
            <div className="space-y-4">
              <p className=" text-white text-2xl">Hit Die: d{claseData.hit_die}</p>
            </div>

            <ul className="list-disc list-inside my-4 text-white text-4xl">
              When you start with this class, you must...
              {claseData.proficiency_choices.map((desc) => (
                <li key={desc.desc} className="text-white text-2xl">{desc.desc}</li>
              ))}
            </ul>
            <h3 className="mb-2 text-white text-4xl">Proficiencies:</h3>
            <ul className="list-disc list-inside text-white">
              {claseData.proficiencies.map((prof) => (
                <li key={prof.index} className="text-white text-2xl">{prof.name}</li>
              ))}
            </ul>
          </div>

          {/* Starting Equipment */}
          <div className="bg-slate-700 bg-opacity-80 p-6 rounded-lg shadow-md">
            <h2
              className="text-4xl text-center mb-4 text-white"
            >
              Starting Equipment
            </h2>
            <ul className="list-disc list-inside">
              {claseData.starting_equipment.map((equip, index) => (
                <li key={index} className="text-white text-2xl">
                  {equip.equipment.name} x {equip.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
