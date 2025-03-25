import Header from "@/components/common/Header";
import Link from "next/link";
import { Jersey_10 } from '@next/font/google';


const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });

export default function landing () {
    return(
        <div className={`bg-black text-white w-full min-h-screen flex flex-col items-center justify-start bg-fixed ${jersey_10.className}`}>    
            <img
                src="/img_interior_caverna.jpeg"
                alt="landimg"
                layout="fill"
                className=" object-cover w-full h-screen opacity-30 z-0 fixed"
            />
            <div className="container w-10/12 h-24 flex flex-col m-10 items-center justify-start gap-5 z-10">

                <div className="w-full h-28">
                    <Header/>
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

                <div className="w-full h-auto flex justify-center items-center">
                <Link className="group w-1/2 bg-purple-700 text-white text-2xl p-4 rounded-xl hover:bg-purple-900 hover:text-black ease-out duration-500"
                href='/interfaz_Usuario'>
                    <span class="text-center">Start your adventure!!</span>
                </Link>
                <Link className="group w-1/2 bg-purple-700 text-white text-2xl p-4 rounded-xl hover:bg-purple-900 hover:text-black ease-out duration-500"
                href='/product'>
                    <span class="text-center">Start your adventure!!</span>
                </Link>
                </div>
            </div>
        </div>
    )
}