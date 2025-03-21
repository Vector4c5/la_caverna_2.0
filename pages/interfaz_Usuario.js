import Link from 'next/link';

export default function interfaz_Usuario() {
    return(
        <div 
        className="flex flex-col items-center justify-center min-h-screen py-2 bg-yellow-200"
        >
            <Link href="/index"
                className="p-6 mt-6 text-center text-black border w-96 rounded-xl bg-white hover:bg-blue-600 hover:text-white ease-out duration-500">
                Inicio
            </Link>
        </div>
    )
}