import {useSession, signIn, signOut} from 'next-auth/react';
import { use } from 'react';
import { Jersey_10 } from '@next/font/google';
import { FaUserAstronaut } from "react-icons/fa";


const jersey_10 = Jersey_10({ weight: '400', subsets: ['latin'] });

export default function LoginBtn() {
    const {data:session}=useSession();
    if (session){
        return(
            <>
                <Link href='inerfaz_Usuario' className={`flex items-center gap-4 mx-2 group-hover:translate-x-4 transition 
                            duration-300 ease-in-out ${jersey_10.className}` }>
                                <div className="opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out scale-150">
                                    <MdPlayArrow />
                                </div>
                                <div className="scale-150">
                                    <FaUserAstronaut />
                                </div>
                                <p className="text-3xl">
                                {session.user.email}
                                </p>
                            </Link>
            </>
        )
    }
    return(
        <>
            No estas logeado<br/>
            <button onClick={()=>signIn()}>Iniciar sesion con gogle</button>
        </>
    )
}