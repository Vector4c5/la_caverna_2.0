import React from 'react';
import Link from 'next/link';

const BookPreview = ({ title, image, description, link = '#' }) => {
  return (
    <Link href={link} className="flex justify-center">
      <div className="relative w-[300px] h-[400px] group cursor-pointer transform transition-transform duration-300 hover:scale-105">
        {/* Imagen de fondo que abarca todo */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 opacity-100"
          style={{ backgroundImage: `url(${image || '/placeholder-book.jpg'})` }}
        />
        {/* Overlay oscuro que se aclara en hover */}
        <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />

        {/* Contenedor principal con el efecto de revelación */}
        <div 
          className="absolute inset-0 w-[75%] h-full transition-all duration-500 
          group-hover:w-full overflow-hidden"
        >
          {/* Contenido del libro */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6">
            <div className="relative z-10">
              <h3 className="text-2xl text-center font-bold text-white mb-2 font-['Press_Start_2P']">
                {title}
              </h3>
            </div>
            <p className="text-black text-sm text-center font-['Press_Start_2P'] p-2 opacity-0 group-hover:opacity-100 
            bg-white bg-opacity-0 group-hover:bg-opacity-80 rounded-xl transition-opacity 
              duration-300">
                {description}
              </p>
          </div>
        </div>

        {/* Efecto de reflejo/sombra */}
        <div 
          className="absolute right-0 top-0 w-1/4 h-full bg-gradient-to-l 
          from-white/20 to-transparent transition-all duration-500 
          group-hover:opacity-0"
        />
      </div>
    </Link>
  );
};

export default BookPreview; 