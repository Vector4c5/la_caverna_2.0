import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import StarAnimation from "@/components/common/StartAnimation";
import { Jersey_10 } from '@next/font/google';

const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });

export default function SpellDetails() {
  const router = useRouter();
  const { slug } = router.query;
  const [spell, setSpell] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      axios
        .get(`https://www.dnd5eapi.co/api/spells/${slug}`)
        .then((res) => {
          setSpell(res.data); // Save data to state
          setLoading(false); // Remove loading state
        })
        .catch((error) => {
          console.error("Error fetching the spell:", error);
          setError(error);
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h2 className="text-5xl font-['Press_Start_2P'] text-white">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h2 className="text-5xl font-['Press_Start_2P'] text-white">
          Error loading the spell
        </h2>
      </div>
    );
  }

  if (!spell) return null;

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
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover opacity-15 z-10"
      />
      <h2 className="text-center text-2xl md:text-6xl  mb-5 z-20 text-white">
        {spell.name}
      </h2>
      <div className="container flex flex-col md:flex-row w-full md:w-10/12 h-auto gap-4">
        <div className="container flex flex-col p-4 md:p-6 w-full md:w-1/2 h-auto text-justify bg-gray-800 bg-opacity-100 rounded-xl gap-2 z-20">
          <h2 className="text-4xl md:text-4xl text-center text-white">
            Description:
          </h2>
          <p className="text-2xl text-white">{spell.desc}</p>
          <p className="text-2xl text-white">{spell.higher_level}</p>
        </div>

        <div className="container flex flex-col p-4 md:p-6 w-full md:w-1/2 h-auto bg-gray-800 bg-opacity-100 rounded-xl gap-2 z-20">
          <h2 className="text-xl md:text-4xl text-center text-white">
            Characteristics:
          </h2>
          <ul className="flex flex-col list-disc pl-5">
            <p className="text-2xl text-white">
              Required level: {spell.level}
            </p>

            <p className="text-2xl text-white">
              Range: {spell.range}
            </p>

            <p className="text-2xl text-white">
              Casting time: {spell.casting_time}
            </p>
            {spell?.damage?.damage_at_slot_level && (
              <p className="text-2xl text-white">
                Damage at Slot Levels:
                <ul className="list-disc pl-5 text-white">
                  {Object.entries(spell.damage.damage_at_slot_level).map(
                    ([level, damage]) => (
                      <li key={level} className="text-2xl">
                        Level {level}: {damage}
                      </li>
                    )
                  )}
                </ul>
              </p>
            )}
            <p className="text-4xl text-white">
              Classes that can use it:
              <ul className="list-disc pl-5 text-white">
                {spell.classes.map((clase) => (
                  <li key={clase.index} className="text-2xl">
                    {clase.name}
                  </li>
                ))}
                {spell.subclasses.map((clase) => (
                  <li key={clase.index} className="text-2xl">
                    {clase.name}
                  </li>
                ))}
              </ul>
            </p>
          </ul>
        </div>
      </div>
    </main>
  );
}
