import {useSession, signIn, signOut} from 'next-auth/react';
import { use } from 'react';

export default function LoginBtn() {
    const {data:session}=useSession();
    if (session){
        return(
            <>
                Estas Logeado con {session.user.email}<br/>
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