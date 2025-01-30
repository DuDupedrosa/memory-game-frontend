import Image from "next/image";
import Shark from "@/assets/img/shark.jpg";
import Crocodile from "@/assets/img/crocodile.jpg";
import Racum from "@/assets/img/racum.jpg";
import Spider from "@/assets/img/spider.jpg";
import Tucano from "@/assets/img/tucano.jpg";

function MemoryCard({ imagePath }: { imagePath: any }) {
  return (
    <div className="w-36 h-36 rounded-lg shadow-md bg-yellow-300">
      <Image
        className="max-w-36 h-36 rounded-lg"
        src={imagePath}
        alt={"Memory image"}
      />
    </div>
  );
}

export default function HomePage() {
  const images = [
    Shark,
    Shark,
    Crocodile,
    Crocodile,
    Racum,
    Racum,
    Tucano,
    Tucano,
    Spider,
    Spider,
  ];

  function seededRandom(seed: number) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function shuffleArray(array: string[], seed: number) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed) * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap
      seed++;
    }
    return array;
  }

  // Recebendo a semente do backend
  //const seed = 12345; // Exemplo de número de semente recebido
  //const shuffledImages = shuffleArray(images, seed);

  return (
    <div className="w-full h-full min-h-screen bg-page-primary">
      <h2 className="text-5xl text-white font-semibold text-center pt-8 mb-12">
        Memory game
      </h2>

      <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-5 max-w-max mx-auto">
        {images.map((image, i) => {
          return (
            <div
              key={i}
              className="w-36 h-36 rounded-lg shadow-md bg-yellow-300"
            >
              <Image
                className="max-w-36 h-36 rounded-lg"
                src={image}
                alt={"Memory game image"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
