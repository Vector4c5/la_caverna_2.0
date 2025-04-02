import Header from "@/components/common/Header";
import Link from "next/link";
import { Jersey_10 } from '@next/font/google';


const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });

export default function landing() {
    return (
        <div className={`bg-black text-white w-full min-h-screen flex flex-col items-center justify-start bg-fixed ${jersey_10.className}`}>
            <img
                src="/img_interior_caverna.jpeg"
                alt="landimg"
                layout="fill"
                className=" object-cover w-full h-screen opacity-30 z-0 fixed"
            />
            <div className="container w-10/12 h-24 flex flex-col m-10 items-center justify-start gap-5 z-10">

                <div className="w-full h-28">
                    <Header />
                </div>


                <div className="container w-full h-auto flex flex-col items-center justify-center m-0 p-10
                bg-black bg-opacity-60  border-4 border-dashed border-teal-600 rounded-xl">
                    <h1
                        className="text-5xl text-center text-white">
                        Welcome to The Cavern
                    </h1>
                    <p className="text-justify text-white  text-2xl mb-5 p-4">
                        If you are a novice adventurer or a Dungeon Master looking for
                        resources, you have come to the right place. In The Cavern, you
                        will find guides, tools, and tips to start your journey in
                        Dungeons & Dragons. From basic rules to ideas for creating your
                        own campaign, everything you need to dive into the world of
                        role-playing is right here. Grab your dice, gather your party,
                        and get ready for adventure!
                    </p>
                </div>
                

                <div className="flex flex-col sm:flex-row w-11/12 h-auto justify-center gap-4 my-6">
            <div
                className="flex flex-col w-full sm:w-1/2 h-auto p-5 m-2 bg-gray-800 bg-opacity-50 rounded-2xl
            border-dashed border-4 border-blue-900"
            >
                <h2
                    className="text-2xl text-white  sm:text-3xl text-center w-full text-whit
            p-5"
                >
                    Looking for someone to play with?
                </h2>
                <p className="text-justify text-white text-2xl">
                    Dungeons & Dragons (D&D) is a role-playing game where stories
                    come to life in epic fantasy worlds. To enjoy the adventure, a
                    great group is key. Join our Closed Facebook Group, connect with
                    players and DMs, and find games both online and in person.
                    Experience the magic of D&D with the community!
                </p>
                <div className="w-full h-autp flex justify-center my-4">
                    <Link
                        className="group w-auto h-auto p-4 m-2 bg-red-700 border-solid border-2 border-white hover:scale-105 hover:bg-red-600 transition-all ease-out 
            duration-500"
                        href="https://discord.gg/YzqMRypkYz"
                    >
                        <h3 className="text-center text-lg text-white  font-['Press_Start_2P']">
                            Join the community!
                        </h3>
                    </Link>
                </div>
            </div>
            <div
                className="flex flex-col w-full sm:w-1/2 h-auto p-5 m-2 bg-gray-800 bg-opacity-50 rounded-2xl
            border-dashed border-4 border-green-900"
            >
                <h2
                    className="text-2xl sm:text-3xl text-white  text-center w-full
            p-5"
                >
                    Are you interested in learning more about us?
                </h2>
                <p className="text-justify text-white  text-2xl">
                    La Caverna is a project created to help inexperienced
                    role-players dive into the world of D&D, as well as assist
                    Dungeon Masters in creating their own campaigns and enhancing
                    their game experience. If you want to learn more about us,
                    follow us on our social media!
                </p>
                <div className="w-full h-autp flex justify-center my-4">
                    <Link
                        className="group w-auto h-auto p-4 m-2 bg-pink-700 border-solid border-2 border-white hover:scale-105 hover:bg-pink-600 transition-all ease-out 
            duration-500"
                        href="https://www.instagram.com/vector4c57/"
                    >
                        <h3 className="text-center text-white  text-lg font-['Press_Start_2P']">
                            Follow us on Instagram!
                        </h3>
                    </Link>
                </div>
            </div>
        </div>

                <div className="w-full h-auto flex justify-center items-center">
                    <Link className="group w-1/2 bg-purple-700 text-white text-2xl p-4 rounded-xl hover:bg-purple-900 hover:text-black ease-out duration-500"
                        href='/interfaz_Usuario'>
                        <span class="text-center">Start your adventure!!</span>
                    </Link>
                    <Link className="group w-1/2 bg-purple-700 text-white text-2xl p-4 rounded-xl hover:bg-purple-900 hover:text-black ease-out duration-500"
                        href='/product'>
                        <span className="text-center">Start your adventure!!</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}


