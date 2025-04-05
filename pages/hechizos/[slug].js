import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import StarAnimation from "@/components/common/StartAnimation";

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
    <div className="w-full p-4 md:p-10 flex flex-col items-center bg-black gap-4 h-screen overflow-y-auto">
      <div className="w-full h-auto flex justify-center mb-5">
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
      <h2 className="text-center text-2xl md:text-4xl font-['Press_Start_2P'] mb-5 z-20 text-white">
        {spell.name}
      </h2>
      <div className="container flex flex-col md:flex-row w-full md:w-10/12 h-auto gap-4">
        <div className="container flex flex-col p-4 md:p-6 w-full md:w-1/2 h-auto text-justify bg-gray-800 bg-opacity-100 rounded-xl gap-2 z-20">
          <h2 className="text-xl md:text-2xl text-center text-white font-['Press_Start_2P']">
            Description:
          </h2>
          <p className="text-lg text-white md:text-xl">{spell.desc}</p>
          <p className="text-lg text-white md:text-xl">{spell.higher_level}</p>
        </div>

        <div className="container flex flex-col p-4 md:p-6 w-full md:w-1/2 h-auto bg-gray-800 bg-opacity-100 rounded-xl gap-2 z-20">
          <h2 className="text-xl text-white md:text-2xl text-center font-['Press_Start_2P']">
            Characteristics:
          </h2>
          <ul className="flex flex-col list-disc pl-5">
            <p className="text-lg md:text-xl text-white">
              <strong>Required level:</strong> {spell.level}
            </p>

            <p className="text-lg md:text-xl text-white">
              <strong>Range:</strong> {spell.range}
            </p>

            <p className="text-lg md:text-xl text-white">
              <strong>Casting time:</strong> {spell.casting_time}
            </p>
            {spell?.damage?.damage_at_slot_level && (
              <p className="text-lg md:text-xl text-white">
                <strong>Damage at Slot Levels:</strong>
                <ul className="list-disc pl-5 text-white">
                  {Object.entries(spell.damage.damage_at_slot_level).map(
                    ([level, damage]) => (
                      <li key={level}>
                        Level {level}: {damage}
                      </li>
                    )
                  )}
                </ul>
              </p>
            )}
            <p className="text-lg md:text-xl text-white">
              <strong>Classes that can use it:</strong>
              <ul className="list-disc pl-5 text-white">
                {spell.classes.map((clase) => (
                  <li key={clase.index}>{clase.name}</li>
                ))}
                {spell.subclasses.map((clase) => (
                  <li key={clase.index}>{clase.name}</li>
                ))}
              </ul>
            </p>
          </ul>
        </div>
      </div>
    </div>
  );
}
