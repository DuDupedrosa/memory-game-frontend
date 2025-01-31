"use client";

import Image from "next/image";
import Shark from "@/assets/img/shark.jpg";
import Crocodile from "@/assets/img/crocodile.jpg";
import Racum from "@/assets/img/racum.jpg";
import Spider from "@/assets/img/spider.jpg";
import Tucano from "@/assets/img/tucano.jpg";
import { useEffect, useState } from "react";
import { apiService } from "@/app/apiService";
import { RoomDataType } from "@/types/room";
import { socket } from "@/app/socket";
import { getUserLocal } from "@/helpers/getUserLoca";
import { useRouter } from "next/navigation";

type CardImage = {
  id: number;
  key: string;
  isFlipped: boolean;
  isMatched: boolean;
  image: any;
};

export default function GameBoard({ id }: { id: number | null }) {
  const [roomData, setRoomData] = useState<RoomDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [flippedImages, setFlippedImages] = useState<CardImage[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false);
  const [roundScore, setRoundScore] = useState<number>(0);
  const [enemyScore, setEnemyScore] = useState<number>(0);
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
      isFlipped: false,
      isMatched: false,
      image: Racum,
    },
    {
      id: 6,
      key: "RACUM",
      isFlipped: false,
      isMatched: false,
      image: Racum,
    },
    {
      id: 7,
      key: "TUCANO",
      isFlipped: false,
      isMatched: false,
      image: Tucano,
    },
    {
      id: 8,
      key: "TUCANO",
      isFlipped: false,
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

  function seededRandom(seed: number) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function shuffleArray(array: CardImage[], seed: number) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed) * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap
      seed++;
    }
    return array;
  }

  async function handleFlipCard(index: number) {
    try {
      const { data } = await apiService.get(
        `room/${roomData?.id}/player-allowed-to-play`
      );

      // se não for o player atual, ele é expectador.
      if (!data.content.playerIsAllowed) return;
      if (flippedImages.length === 2) return;
      const image = images[index];
      const imageFlipped = flippedImages.find((img) => img.id === image.id);

      // previnir o click na imagem aberta
      if (!image.isMatched && !imageFlipped) {
        socket.emit("requestFlipCard", {
          roomId: roomData?.id,
          id: image.id,
        });
      }
    } catch (err) {}
  }

  function handleFlippedCard(id: number) {
    try {
      // não pode abrir mais de 2 cartas
      const image = images.find((image) => image.id === id);

      if (!image) return;

      // atualizando o board
      const newImages = images.map((image) => {
        if (image.id === id) image.isFlipped = true;

        return image;
      });
      setImages(newImages);

      // salvando as imagens que foram viradas
      const payload = [...flippedImages, image];

      setFlippedImages((prevFlippedImages) => [...prevFlippedImages, image]);
    } catch (err) {}
  }

  function handleChangedPlayerTurn(playerId: string) {
    try {
      const user = getUserLocal();
      if (!user) return;

      setIsPlayerTurn(playerId === user.id);

      setTimeout(() => {
        const payload = images.map((image) => {
          if (image.isFlipped) image.isFlipped = false;

          return image;
        });

        setImages(payload);
      }, 1000);
    } catch (err) {}
  }

  function handleMarkedPoint(playerId: string, value: number) {
    const user = getUserLocal();
    if (!user) return;

    if (user.id === playerId) {
      setRoundScore(value);
    } else {
      setEnemyScore(value);
    }
  }

  // Recebendo a semente do backend
  //const seed = 12345; // Exemplo de número de semente recebido
  //const shuffledImages = shuffleArray(images, seed);

  useEffect(() => {
    shuffleArray(
      images.map((image) => image.image),
      100
    );
    setLoading(false);

    const fetchRoom = async (roomId: number) => {
      try {
        const { data } = await apiService.get(`room/${roomId}`);
        const user = localStorage.getItem("user");
        if (!user) return;

        const parsedUser = JSON.parse(user);
        const { playerReleasedToPlay } = data.content;

        setRoomData(data.content);
        setIsPlayerTurn(parsedUser.id === playerReleasedToPlay);
      } catch (err) {}
    };

    if (id) {
      fetchRoom(id);
    }
  }, [id]);

  useEffect(() => {
    if (roomData) {
      const shuffledImages = shuffleArray(images, roomData.matchRandomNumber);
      setImages(shuffledImages);
      setLoading(false);
    }
  }, [roomData]);

  useEffect(() => {
    const handleFlippedCardListener = (data: { id: number }) => {
      handleFlippedCard(Number(data.id));
    };

    const handleChangedPlayerTurnListener = (data: {
      roomId: string;
      playerId: string;
    }) => {
      handleChangedPlayerTurn(data.playerId);
    };

    const handleMarkedPointListener = (data: {
      roomId: number;
      playerId: string;
      value: number;
    }) => {
      handleMarkedPoint(data.playerId, data.value);
    };

    // Registrar os listeners
    socket.on("flippedCard", handleFlippedCardListener);
    socket.on("changedPlayerTurn", handleChangedPlayerTurnListener);
    socket.on("markedPoint", handleMarkedPointListener);

    // Remover os listeners ao desmontar o componente ou recriar o efeito
    return () => {
      socket.off("flippedCard", handleFlippedCardListener);
      socket.off("changedPlayerTurn", handleChangedPlayerTurnListener);
      socket.off("markedPoint", handleMarkedPointListener);
    };
  }, [socket]);

  useEffect(() => {
    if (flippedImages.length === 2) {
      // ou seja, selecionou duas imagens iguais.
      const matchPoint =
        flippedImages[0].key === flippedImages[1].key &&
        !flippedImages[0].isMatched &&
        !flippedImages[1].isMatched;

      if (matchPoint) {
        const user = getUserLocal();
        if (!user) return;
        // seta para ficar aberta pra sempre
        // emitir o evento do ponto do jogador
        const payload = images.map((image) => {
          if (image.key === flippedImages[0].key) {
            image.isMatched = true;
            image.isFlipped = false;
          }

          return image;
        });

        setImages(payload);

        if (isPlayerTurn) {
          socket.emit("requestMakePoint", {
            playerId: user.id,
            roomId: roomData?.id,
          });
        }
      } else {
        socket.emit("requestChangePlayerTurn", {
          roomId: roomData?.id,
        });
      }

      setFlippedImages([]);
    }
  }, [flippedImages]);

  return (
    <div className="w-full h-full min-h-screen bg-page-primary">
      <h2 className="text-5xl text-white font-semibold text-center pt-8 mb-12">
        Memory game
      </h2>
      <span className="block text-3xl">
        {isPlayerTurn ? "Sua vez de jogar" : "Aguarde sua vez"}
      </span>
      <span className="text-lg font-bold block mb-2">
        Meus pontos: {roundScore}
      </span>
      <span className="text-lg font-bold block">
        Pontos do adversário: {enemyScore}
      </span>
      {!loading && (
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-5 max-w-max mx-auto">
          {images &&
            images.length > 0 &&
            images.map((image, i) => {
              return (
                <div
                  onClick={() => {
                    handleFlipCard(i);
                  }}
                  key={i}
                  className="w-36 h-36 rounded-lg shadow-md bg-yellow-300 cursor-pointer"
                >
                  <Image
                    className={`w-36 h-36 rounded-lg ${
                      image.isFlipped || image.isMatched
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                    src={image.image}
                    alt={"Memory game image"}
                  />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
