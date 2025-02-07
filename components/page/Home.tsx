"use client";
import Image from "next/image";
import MainHeader from "../MainHeader";
import Logo from "@/assets/icons/memory-game-logo.svg";
import Shark from "@/assets/img/shark.jpg";
import Crocodile from "@/assets/img/crocodile.jpg";
import Racum from "@/assets/img/racum.jpg";
import Spider from "@/assets/img/spider.jpg";
import Tucano from "@/assets/img/tucano.jpg";
import { useState } from "react";
import { CardImage } from "@/types/game";
import { Button } from "../ui/button";
import FireImg from "@/assets/img/fire.png";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [images, setImages] = useState<CardImage[]>([
    {
      id: 1,
      key: "SHARK",
      isFlipped: false,
      isMatched: false,
      image: Shark,
    },
    {
      id: 2,
      key: "SHARK",
      isFlipped: false,
      isMatched: false,
      image: Shark,
    },
    {
      id: 3,
      key: "CROCODILE",
      isFlipped: false,
      isMatched: false,
      image: Crocodile,
    },
    {
      id: 4,
      key: "CROCODILE",
      isFlipped: false,
      isMatched: false,
      image: Crocodile,
    },
    {
      id: 5,
      key: "RACUM",
      isFlipped: true, // Deixar o Racum aberto
      isMatched: false,
      image: Racum,
    },
    {
      id: 6,
      key: "RACUM",
      isFlipped: true, // Deixar o Racum aberto
      isMatched: false,
      image: Racum,
    },
    {
      id: 7,
      key: "TUCANO",
      isFlipped: true, // Deixar o Tucano aberto
      isMatched: false,
      image: Tucano,
    },
    {
      id: 8,
      key: "TUCANO",
      isFlipped: true, // Deixar o Tucano aberto
      isMatched: false,
      image: Tucano,
    },
    {
      id: 9,
      key: "SPIDER",
      isFlipped: false,
      isMatched: false,
      image: Spider,
    },
    {
      id: 10,
      key: "SPIDER",
      isFlipped: false,
      isMatched: false,
      image: Spider,
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen h-full bg-gray-900 px-5 bg-animated-dark text-white pb-12 relative">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="particle"></span>
        ))}
      </div>

      {/* Fundo com Gradiente Radial */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-900 via-gray-800 to-black opacity-70"></div>

      {/* Logo e título */}
      <div className="flex flex-col items-center mt-8 relative z-10">
        <Image
          className="w-48 h-48 rounded"
          alt="memory-game-logo"
          src={Logo}
        />
        <h1 className="text-3xl md:text-4xl font-bold text-center mt-4 animate-fade-in">
          Teste sua memória agora!
        </h1>
        <p className="text-gray-300 mt-2 text-base md:text-lg text-center max-w-md">
          Melhore sua memória e divirta-se com nosso jogo gratuito.
        </p>

        {/* Novo Texto: Jogo Online 1v1 */}
        <p className="text-purple-400 mt-2 text-base md:text-lg flex items-start gap-2 font-medium md:font-semibold bg-gray-800 px-4 py-2 rounded-lg shadow-md">
          <Image alt="fire" src={FireImg} className="md:w-10 md:h-10 w-6 h-6" />{" "}
          Desafie um amigo em um duelo 1v1 online!
        </p>
      </div>

      {/* Botões de ação destacados */}
      <div className="flex justify-center items-center mt-8 gap-5 relative z-10">
        <Button
          onClick={() => router.push("/auth")}
          className="h-14 px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-700 to-purple-500 rounded-lg shadow-lg transition-transform hover:scale-110 hover:shadow-purple-500/50"
        >
          Jogar Agora
        </Button>
        <Button
          onClick={() => router.push("/auth")}
          className="h-14 px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-gray-700 to-gray-500 rounded-lg shadow-lg transition-transform hover:scale-110 hover:shadow-gray-500/50"
        >
          Criar Conta
        </Button>
      </div>

      {/* Preview do jogo */}
      <div className="grid grid-cols-3 mt-12 md:grid-cols-4 gap-5 max-w-max mx-auto relative z-10">
        {images?.map((image, i) => (
          <div
            key={i}
            className="relative w-24 h-24 md:w-36 md:h-36 rounded-lg cursor-pointer shadow-lg transition-transform hover:scale-105"
          >
            {/* Parte de trás da carta */}
            <div
              className={`absolute inset-0 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold ${
                image.isFlipped || image.isMatched ? "hidden" : ""
              }`}
            >
              ?
            </div>

            {/* Parte da frente da carta */}
            <div
              className={`absolute inset-0 rounded-lg bg-purple-900 transition-opacity duration-300 ease-in-out ${
                image.isFlipped || image.isMatched ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                className="w-full h-full object-cover rounded-lg"
                src={image.image}
                alt="Memory game image"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
