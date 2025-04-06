import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/common/Header";
import StarAnimation from "@/components/common/StartAnimation";
import { Jersey_10 } from '@next/font/google';

const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });

export default function MonsterDetails() {
  const router = useRouter();
  const { slug } = router.query;
  const [monster, setMonster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spells, setSpells] = useState([]);

  useEffect(() => {
    if (slug) {
      axios
        .get(`https://www.dnd5eapi.co/api/monsters/${slug}`)
        .then(async (res) => {
          setMonster(res.data);
          setLoading(false);

          if (res.data.special_abilities) {
            const spellcasting = res.data.special_abilities.find(
              (ability) => ability.spellcasting
            );

            if (spellcasting) {
              const spellSlugs = spellcasting.spellcasting.spells.map((spell) =>
                spell.url.split("/").pop()
              );

              const spellRequests = spellSlugs.map((slug) =>
                axios.get(`https://www.dnd5eapi.co/api/spells/${slug}`)
              );

              try {
                const spellResponses = await Promise.all(spellRequests);
                const spellDetails = spellResponses.map((res) => ({
                  name: res.data.name,
                  full_name: res.data.full_name || res.data.name,
                  desc: res.data.desc
                    ? res.data.desc.join(" ")
                    : "No description available",
                }));
                setSpells(spellDetails);
              } catch (spellError) {
                console.error("Error fetching spell details:", spellError);
              }
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching the monster:", error);
          setError(error);
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <h2 className="text-5xl font-['Press_Start_2P'] text-white">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h2 className="text-5xl text-center font-['Press_Start_2P'] w-full text-white">
          Error loading the monster
        </h2>
      </div>
    );
  }

  return (
    <main className={`bg-black text-white w-full min-h-screen flex flex-col items-center justify-start bg-fixed overflow-y-auto ${jersey_10.className}`}>
      <div className="w-11/12 h-auto flex justify-center my-5 z-50">
        <Header />
      </div>
      <div className="fixed w-full h-screen z-0 opacity-40">
        <StarAnimation />
      </div>
      <img
        src="/Fondo_Biblioteca.jpeg"
        alt="Welcome background"
        className="fixed top-0 left-0 w-full h-full object-cover opacity-30 z-10"
      />
      <h1 className="text-6xl text-white md:text-5xl text-center z-30 my-4">
        {monster.name}
      </h1>

      <div
        className="p-4 md:p-6 w-full md:w-10/12 h-auto text-justify bg-gray-800 bg-opacity-80 rounded-xl gap-4 z-30"
      >
        <p className="col-span-2 text-center text-white text-lg md:text-xl">{monster.desc}</p>
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
          <h2 className="col-span-2 text-xl text-white md:text-4xl text-justify">
            Characteristics:
          </h2>
          <p className="text-justify text-xl text-white md:text-2xl">
            Size: {monster.size}
          </p>
          <p className="text-justify text-xl text-white md:text-2xl">
            Hit points: {monster.hit_points}
          </p>
          <p className="text-justify text-xl text-white md:text-2xl">
            Hit dice: {monster.hit_dice}
          </p>
          <p className="text-justify text-xl text-white md:text-2xl">
            Hit points roll: {monster.hit_points_roll}
          </p>
          <p className="text-justify text-xl text-white md:text-2xl">
            Speed: {monster.speed.walk}
          </p>
          <p className="text-justify text-xl text-white md:text-2xl">
            Strength: {monster.strength}
          </p>
          <p className="text-justify text-xl text-white md:text-2xl">
            Constitution: {monster.constitution}
          </p>
          <p className="text-justify text-xl text-white md:text-2xl">
            Intelligence: {monster.intelligence}
          </p>
          <p className="text-justify text-xl text-white  md:text-2xl">
            Wisdom: {monster.wisdom}
          </p>
          <p className="text-justify text-xl text-white md:text-2xl">
            Charisma: {monster.charisma}
          </p>
        </div>

        {spells.length > 0 && (
          <div className="col-span-2">
            <h3 className="text-xl text-white md:text-4xl my-2">Spells:</h3>
            <ul className="list-disc pl-5 text-white first-letter:">
              {spells.map((spell) => (
                <li key={spell.name} className="text-justify text-lg md:text-4xl text-white">
                  {spell.full_name}:
                  <p className="m-2 text-2xl">{spell.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="container my-4">
          <h2 className="col-span-2 text-xl text-white md:text-4xl text-justify">
            Special Abilities and Actions:
          </h2>
          <ul className="list-disc pl-5 text-white">
            {monster.special_abilities.map((ability) => (
              <li key={ability.name} className="my-4 text-white text-4xl">
                {ability.name}
                <p className="text-white text-2xl">{ability.desc}</p>
              </li>
            ))}
          </ul>
          <ul className="list-disc pl-5 text-white">
            {monster.actions.map((action) => (
              <li key={action.name} className="my-4 text-white text-4xl">
                {action.name}
                <p className="text-white text-2xl">{action.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
