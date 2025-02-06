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
import DialogWinOrLose from "./DialogWinOrLose";
import { toast } from "sonner";
import AstronautaSvg from "@/assets/icons/astronauta.svg";
import AlienSvg from "@/assets/icons/alien.svg";
import Confetti from "react-confetti";

type CardImage = {
  id: number;
  key: string;
  isFlipped: boolean;
  isMatched: boolean;
  image: any;
};

export default function GameBoard({
  id,
  playAgain,
}: {
  id: number | null;
  playAgain: () => void;
}) {
  const [roomData, setRoomData] = useState<RoomDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [flippedImages, setFlippedImages] = useState<CardImage[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false);
  const [roundScore, setRoundScore] = useState<number>(0);
  const [enemyScore, setEnemyScore] = useState<number>(0);
  const router = useRouter();
  const [dialogWinOrLose, setDialogWinOrLose] = useState<{
    open: boolean;
    win: boolean;
  }>({ open: false, win: false });

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

  function handlePlayAgai() {
    setDialogWinOrLose({
      open: false,
      win: false,
    });
    playAgain();
  }

  async function handleWin(winnerId: string) {
    const user = getUserLocal();
    if (!user) return;

    // jogador ganhou
    if (winnerId === user.id) {
      setDialogWinOrLose({
        open: true,
        win: true,
      });
    } else {
      //perdeu
      setDialogWinOrLose({
        open: true,
        win: false,
      });
    }
  }

  function handleMarkedPoint(playerId: string, value: number) {
    const user = getUserLocal();
    if (!user) return;

    if (value === 3) {
      socket.emit("requestGameWin", {
        roomId: id,
        winnerPlayerId: playerId,
      });
    }

    if (user.id === playerId) {
      setRoundScore(value);
    } else {
      setEnemyScore(value);
    }
  }

  function handleExitGame() {
    setDialogWinOrLose({
      open: false,
      win: false,
    });
    toast.warning("O jogador saiu da sala, entre novamente.");
    router.replace("/room");
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

    const handleWinListener = (data: {
      roomId: string;
      winnerPlayerId: string;
    }) => {
      handleWin(data.winnerPlayerId);
    };

    const handleExitGameListener = (data: {
      roomId: string;
      playerId: string;
    }) => {
      handleExitGame();
    };

    // Registrar os listeners
    socket.on("flippedCard", handleFlippedCardListener);
    socket.on("changedPlayerTurn", handleChangedPlayerTurnListener);
    socket.on("markedPoint", handleMarkedPointListener);
    socket.on("gameWin", handleWinListener);
    socket.on("exitGame", handleExitGameListener);

    // Remover os listeners ao desmontar o componente ou recriar o efeito
    return () => {
      socket.off("flippedCard", handleFlippedCardListener);
      socket.off("changedPlayerTurn", handleChangedPlayerTurnListener);
      socket.off("markedPoint", handleMarkedPointListener);
      socket.off("gameWin", handleWinListener);
      socket.off("exitGame", handleExitGameListener);
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
            roomId: id,
          });
        }
      } else {
        socket.emit("requestChangePlayerTurn", {
          roomId: id,
        });
      }

      setFlippedImages([]);
    }
  }, [flippedImages]);

  return (
    <div className="flex flex-col min-h-screen h-full bg-gray-900">
      {dialogWinOrLose.open && dialogWinOrLose.win && <Confetti />}
      <div className="pb-12">
        {/* card inicial com placar e dem que é a vez */}
        <div className="w-64 mx-auto mb-12 mt-5 p-4 bg-purple-900 text-purple-300 border-4 border-purple-500 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-bold mb-2">Placar</h2>
          <div className="flex justify-between">
            <div className="flex-1 flex flex-col items-center">
              <span className="font-mono text-sm">(You)</span>
              <span className="block text-2xl font-mono">
                <Image className="w-7" alt="astronauta" src={AstronautaSvg} />
              </span>
              <span className="text-2xl font-mono">{roundScore}</span>
            </div>
            <span className="text-purple-400 font-bold text-2xl font-mono">
              VS
            </span>
            <div className="flex-1 flex flex-col items-center">
              <span className="font-mono text-sm">(Enemy)</span>
              <span className="block">
                <Image alt="alien" className="w-7" src={AlienSvg} />
              </span>
              <span className="text-2xl font-mono">{enemyScore}</span>
            </div>
          </div>

          {/* Mensagem de turno */}
          <div className="mt-4 py-1 md:py-2 px-2 md:px-4 bg-purple-700 text-white rounded-lg shadow-md">
            <span className="block text-lg md:text-2xl font-bold">
              {isPlayerTurn ? "Sua vez de jogar" : "Aguarde sua vez"}
            </span>
          </div>
        </div>

        {!loading && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-5 max-w-max mx-auto">
            {images &&
              images.length > 0 &&
              images.map((image, i) => {
                return (
                  <div
                    onClick={() => handleFlipCard(i)}
                    key={i}
                    className="relative w-24 h-24 md:w-36 md:h-36 rounded-lg cursor-pointer shadow-lg"
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
                      className={`absolute inset-0 rounded-lg bg-purple-900 ${
                        image.isFlipped || image.isMatched
                          ? "opacity-100"
                          : "opacity-0"
                      } transition-opacity duration-300 ease-in-out`}
                    >
                      <Image
                        className="w-full h-full object-cover rounded-lg"
                        src={image.image}
                        alt="Memory game image"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        <DialogWinOrLose
          playAgain={() => handlePlayAgai()}
          roomId={Number(id)}
          open={dialogWinOrLose.open}
          win={dialogWinOrLose.win}
        />
      </div>
    </div>
  );
}
