import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/common/Header";
import StarAnimation from "@/components/common/StartAnimation";
import { Jersey_10 } from '@next/font/google';

const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });

export default function Monster() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("https://www.dnd5eapi.co/api/monsters");
        const data = await response.json();
        const formattedClasses = data.results.map((classItem, index) => ({
          id: index + 1,
          title: classItem.name,
          description: `Make your players suffer with ${classItem.name}`,
          link: `/monsters/${classItem.index}`,
        }));
        setClasses(formattedClasses);
      } catch (error) {
        console.error("Error fetching monsters:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleClaseClick = (index) => {
    router.push(`/monsters/${index}`);
  };

  return (
    <main className={`bg-black text-white w-full min-h-screen flex flex-col items-center justify-start bg-fixed overflow-y-auto ${jersey_10.className}`}>
      <div className="w-10/12 h-auto flex justify-center my-5 z-50">
        <Header />
      </div>
      <div className="fixed w-full h-screen z-0 opacity-40">
        <StarAnimation />
      </div>
      <img
        src="/Fondo_Biblioteca.jpeg"
        alt="Welcome background"
        className="fixed top-0 left-0 w-full h-full object-cover opacity-30 z-0"
      />
      <div
        className="container flex flex-col items-center gap-3 w-11/12 md:w-10/12 h-auto border-solid border-white border-b-2 border-t-2 p-5 
                animate-fade-in-down z-20"
        style={{
          boxShadow:
            "0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 -10px 15px -3px rgba(255, 255, 255, 0.1)",
        }}
      >
        <h1 className="text-center text-2xl md:text-4xl w-full text-white">D&D Monsters</h1>
        <h2 className="text-lg md:text-xl text-center text-cyan-400">
          Choose your monsters
        </h2>
      </div>

      {/* Grid of classes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12 w-10/12 z-20">
        {classes.map((classItem) => (
          <div key={classItem.id} className="flex justify-center">
            <button
              onClick={() => handleClaseClick(classItem.link.split("/").pop())}
              className="w-full h-32 px-5 py-2.5 mt-2 relative group overflow-hidden font-medium
              bg-black bg-opacity-70 text-white inline-block transition-all duration-500
              rounded-lg shadow-md shadow-purple-300
              ease-out transform hover:scale-105"
            >
              <div className="absolute inset-0 flex flex-col justify-center items-center transition-all duration-500 transform group-hover:-translate-y-full">
                <h3
                  className="text-xl md:text-4xl"
                >
                  {classItem.title}
                </h3>
              </div>
              <div
                className="absolute inset-0 flex flex-col justify-center items-center transition-all duration-500 
                            transform translate-y-full group-hover:translate-y-0"
              >
                <span className="w-full h-full absolute opacity-90"></span>
                <p
                  className="relative bg-white bg-opacity-80 rounded-lg m-6 p-4 
                                    text-center text-xs md:text-2xl text-black"
                >
                  {classItem.description}
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
