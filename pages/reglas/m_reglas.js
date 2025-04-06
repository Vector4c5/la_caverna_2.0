import Header from "@/components/common/Header";
import StarAnimation from "@/components/common/StartAnimation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Rules() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          "https://www.dnd5eapi.co/api/rule-sections"
        );
        const data = await response.json();
        const formattedClasses = data.results.map((classItem, index) => ({
          id: index + 1,
          title: classItem.name,
          link: `/reglas/${classItem.index}`,
        }));
        setClasses(formattedClasses);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleClaseClick = (index) => {
    router.push(`/reglas/${index}`);
  };

  return (
    <div className="flex flex-col items-center w-full h-full bg-black p-4 md:p-10">
      <img
        src="/Fondo_Biblioteca.jpeg"
        alt="Welcome background"
        className="fixed top-0 left-0 w-full h-full object-cover opacity-15 z-0"
      />
      <div className="w-full h-auto flex justify-center mb-5">
        <Header />
      </div>
      <div className="fixed w-full h-screen z-10 opacity-40">
        <StarAnimation />
      </div>
      <div
        className="container flex flex-col items-center gap-3 w-full md:w-10/12 h-auto border-solid border-white border-b-2 border-t-2 p-5 
                animate-fade-in-down z-20"
        style={{
          boxShadow:
            "0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 -10px 15px -3px rgba(255, 255, 255, 0.1)",
          fontFamily: "'Press Start 2P', cursive",
        }}
      >
        <h1 className="text-center text-2xl md:text-4xl w-full text-white">
          D&D Roll Rules
        </h1>
        <h2 className="text-lg md:text-xl text-center text-cyan-400">
          Expand your knowledge
        </h2>
      </div>
      <div className="flex flex-col items-center mt-12 w-full md:w-10/12 z-20 overflow-hidden">
        {classes.map((classItem) => (
          <div key={classItem.id} className="flex justify-center w-full md:w-11/12">
            <button
              onClick={() => handleClaseClick(classItem.link.split("/").pop())}
              className="container group w-full h-24 md:h-32 px-5 py-2.5 relative font-medium
                            text-white inline-block border-b-2 border-yellow-500"
            >
              <div className="absolute inset-0 flex flex-col justify-center items-start px-4 md:px-10">
                <h3
                  className="text-lg md:text-2xl group-hover:translate-x-14 md:group-hover:translate-x-5 group-hover:text-gray-400 transition-all duration-300"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                  }}
                >
                  {classItem.title}
                </h3>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-all ease-out duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#FEEE91"
                  className="size-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
