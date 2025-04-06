import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/common/Header";
import StarAnimation from "@/components/common/StartAnimation";
import { Jersey_10 } from '@next/font/google';

const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });

export default function RaceDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [raceData, setRaceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaceData = async () => {
      if (!slug) return;

      try {
        const formattedSlug = slug.toLowerCase().replace(/\s+/g, "-");
        const response = await fetch(
          `https://www.dnd5eapi.co/api/races/${formattedSlug}`
        );

        if (!response.ok) {
          throw new Error("Race not found");
        }

        const data = await response.json();

        if (data.subraces && data.subraces.length > 0) {
          const subracesPromises = data.subraces.map(async (subrace) => {
            const subraceResponse = await fetch(
              `https://www.dnd5eapi.co${subrace.url}`
            );
            return subraceResponse.json();
          });
          const subracesData = await Promise.all(subracesPromises);
          data.subracesDetails = subracesData;
        }

        if (data.traits && data.traits.length > 0) {
          const traitsPromises = data.traits.map(async (trait) => {
            const traitResponse = await fetch(
              `https://www.dnd5eapi.co${trait.url}`
            );
            return traitResponse.json();
          });
          const traitsData = await Promise.all(traitsPromises);
          data.traitsDetails = traitsData;
        }

        setRaceData(data);
      } catch (error) {
        console.error("Error fetching race data:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchRaceData();
    }
  }, [slug, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <h2
          className="text-2xl md:text-4xl text-white"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Loading...
        </h2>
      </div>
    );
  }

  if (!raceData) return null;

  return (
    <main className={`bg-black text-white w-full min-h-screen flex flex-col items-center justify-start bg-fixed overflow-y-auto ${jersey_10.className}`}>
      <div className="w-10/12 h-auto flex justify-center my-5 z-50">
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
      <h1 className="text-4xl md:text-5xl mb-6 text-center z-20 text-white">
        {raceData.name}
      </h1>
      <div className="flex flex-xol w-10/12 justify-center items-center mb-4 z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-20">
          <div className="bg-slate-700 bg-opacity-80 p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-4xl md:text-4xl text-center mb-4 text-white">
              Characteristics
            </h2>
            <div className="space-y-4">
              <p className="text-3xl text-white">Speed: {raceData.speed}</p>
              <p className="text-3xl text-white">Size: {raceData.size}</p>
              <p className="text-3xl text-white">
                Size Description: {raceData.size_description}
              </p>

              <h3 className="text-4xl mb-2 text-white">Ability Bonuses:</h3>
              <ul className="list-disc list-inside text-3xl text-white">
                {raceData.ability_bonuses?.map((bonus, index) => (
                  <li key={index} className="text-white">
                    {bonus.ability_score.name}: +{bonus.bonus}
                  </li>
                ))}
              </ul>

              <h3 className="text-4xl mb-2 text-white">Languages:</h3>
              <p className="text-3xl text-white">{raceData.language_desc}</p>
              <ul className="list-disc list-inside text-3xl text-white">
                {raceData.languages?.map((lang) => (
                  <li key={lang.index} className="text-white">{lang.name}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-700 bg-opacity-80 p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-4xl md:text-4xl text-center mb-4 text-white">
              Racial Traits
            </h2>
            {raceData.traitsDetails && (
              <ul className="list-disc list-inside text-3xl text-white">
                {raceData.traitsDetails.map((trait) => (
                  <div key={trait.index} className="mb-4">
                    <h3 className="text-4xl font-bold text-white">{trait.name}</h3>
                    <p className="text-3xl text-white">{trait.desc[0]}</p>
                  </div>
                ))}
              </ul>
            )}

            {raceData.subracesDetails && raceData.subracesDetails.length > 0 && (
              <div className="mt-6">
                <h2 className="text-4xl mb-4 text-white">
                  Subraces
                </h2>
                {raceData.subracesDetails.map((subrace) => (
                  <div key={subrace.index} className="mb-4">
                    <h3 className="text-4xl font-bold text-white">{subrace.name}</h3>
                    <p className="text-3xl text-white">{subrace.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
