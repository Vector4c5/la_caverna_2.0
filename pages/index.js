import localFont from "next/font/local";
import StarAnimation from "../components/common/StartAnimation";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function Home() {
  return (
    <div
      className="bg-black text-white w-full h-screen flex flex-col items-center justify-center"
    >
      <StarAnimation />
      <img
        src="/img_inicio.jpeg"
        alt="Inicio"
        layout="fill"
        className="absolute object-cover w-full h-screen opacity-30 z-0"
      />

      <div className="relative container w-full h-svh flex flex-col items-center justify-center m-20">
        <div
          className="container w-9/12 h-1/3 p-5 m-2 flex items-center justify-center border-8 border-white border-double bg-black bg-opacity-60"
        >
          <h1
            className={`text-5xl text-center`}
          >
            Welcome to The Cavern
          </h1>
        </div>

        <div className="container w-1/2 h-auto m-2 flex items-center justify-center">
          <Link 
            href="/landing" 
            className="group relative w-9/12 h-auto p-2 border-4 border-double border-yellow-700 rounded-xl bg-black bg-opacity-60 hover:scale-90
            transform transition duration-500 ease-in-out overflow-hidden animate-pulse hover:animate-none">
              <span
              className="relative z-10 w-full h-full text-2xl text-white text-center
              group-hover:text-black flex items-center justify-center transition duration-500 ease-in-out">
                Start your adventure!!
              </span>
              <span className="absolute top-0 left-0 w-full h-full bg-yellow-400 bg-opacity-60 
              transform translate-y-full group-hover:translate-y-0 transition duration-500 ease-in-out">
              </span>
          </Link>
        </div>
      </div>
    </div>
  );
}