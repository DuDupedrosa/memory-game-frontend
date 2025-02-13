"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
import { CardImage } from "@/types/game";
// animal-images
import Preguica from "@/assets/img/board-game-animals/preguica-min.png";
import Foca from "@/assets/img/board-game-animals/foca-min.png";
import Coelho from "@/assets/img/board-game-animals/coelho-min.png";
import Tartaruga from "@/assets/img/board-game-animals/tartaruga-min.png";
import Capivara from "@/assets/img/board-game-animals/capivara-min.png";
import Panda from "@/assets/img/board-game-animals/panda-min.png";
import Papagaio from "@/assets/img/board-game-animals/papagaio-min.png";
import Golfinho from "@/assets/img/board-game-animals/golfinho-min.png";
import Tucano from "@/assets/img/board-game-animals/tucano-min.png";
import Girafa from "@/assets/img/board-game-animals/girafa-min.png";
import PeixePalhaco from "@/assets/img/board-game-animals/peixe-palhaco-min.png";
import OncaPintada from "@/assets/img/board-game-animals/onca-pintada-min.png";
import Coruja from "@/assets/img/board-game-animals/coruja-min.png";
import Lontra from "@/assets/img/board-game-animals/lontra-min.png";
import Arara from "@/assets/img/board-game-animals/arara-min.png";
import { LevelEnum, LevelEnumType } from "@/helpers/enum/levelEnum";

const animal_level_1_imgs: CardImage[] = [
  {
    id: 1,
    key: "PREGUICA",
    isFlipped: false,
    isMatched: false,
    image: Preguica,
  },
  {
    id: 2,
    key: "PREGUICA",
    isFlipped: false,
    isMatched: false,
    image: Preguica,
  },
  {
    id: 3,
    key: "FOCA",
    isFlipped: false,
    isMatched: false,
    image: Foca,
  },
  {
    id: 4,
    key: "FOCA",
    isFlipped: false,
    isMatched: false,
    image: Foca,
  },
  {
    id: 5,
    key: "COELHO",
    isFlipped: false,
    isMatched: false,
    image: Coelho,
  },
  {
    id: 6,
    key: "COELHO",
    isFlipped: false,
    isMatched: false,
    image: Coelho,
  },
  {
    id: 7,
    key: "TARTARUGA",
    isFlipped: false,
    isMatched: false,
    image: Tartaruga,
  },
  {
    id: 8,
    key: "TARTARUGA",
    isFlipped: false,
    isMatched: false,
    image: Tartaruga,
  },
  {
    id: 9,
    key: "CAPIVARA",
    isFlipped: false,
    isMatched: false,
    image: Capivara,
  },
  {
    id: 10,
    key: "CAPIVARA",
    isFlipped: false,
    isMatched: false,
    image: Capivara,
  },
];

const animal_level_2_imgs: CardImage[] = [
  {
    id: 11,
    key: "PANDA",
    isFlipped: false,
    isMatched: false,
    image: Panda,
  },
  {
    id: 12,
    key: "PANDA",
    isFlipped: false,
    isMatched: false,
    image: Panda,
  },
  {
    id: 13,
    key: "PAPAGIO",
    isFlipped: false,
    isMatched: false,
    image: Papagaio,
  },
  {
    id: 14,
    key: "PAPAGIO",
    isFlipped: false,
    isMatched: false,
    image: Papagaio,
  },
  {
    id: 15,
    key: "GOLFINHO",
    isFlipped: false,
    isMatched: false,
    image: Golfinho,
  },
  {
    id: 16,
    key: "GOLFINHO",
    isFlipped: false,
    isMatched: false,
    image: Golfinho,
  },
  {
    id: 17,
    key: "TUCANO",
    isFlipped: false,
    isMatched: false,
    image: Tucano,
  },
  {
    id: 18,
    key: "TUCANO",
    isFlipped: false,
    isMatched: false,
    image: Tucano,
  },
];

const animal_level_3_imgs: CardImage[] = [
  {
    id: 19,
    key: "GIRAFA",
    isFlipped: false,
    isMatched: false,
    image: Girafa,
  },
  {
    id: 20,
    key: "GIRAFA",
    isFlipped: false,
    isMatched: false,
    image: Girafa,
  },
  {
    id: 21,
    key: "PEIXEPALHACO",
    isFlipped: false,
    isMatched: false,
    image: PeixePalhaco,
  },
  {
    id: 22,
    key: "PEIXEPALHACO",
    isFlipped: false,
    isMatched: false,
    image: PeixePalhaco,
  },
  {
    id: 23,
    key: "ONCAPINTADA",
    isFlipped: false,
    isMatched: false,
    image: OncaPintada,
  },
  {
    id: 24,
    key: "ONCAPINTADA",
    isFlipped: false,
    isMatched: false,
    image: OncaPintada,
  },
  {
    id: 25,
    key: "CORUJA",
    isFlipped: false,
    isMatched: false,
    image: Coruja,
  },
  {
    id: 26,
    key: "CORUJA",
    isFlipped: false,
    isMatched: false,
    image: Coruja,
  },
  {
    id: 27,
    key: "LONTRA",
    isFlipped: false,
    isMatched: false,
    image: Lontra,
  },
  {
    id: 28,
    key: "LONTRA",
    isFlipped: false,
    isMatched: false,
    image: Lontra,
  },
  {
    id: 29,
    key: "ARARA",
    isFlipped: false,
    isMatched: false,
    image: Arara,
  },
  {
    id: 30,
    key: "ARARA",
    isFlipped: false,
    isMatched: false,
    image: Arara,
  },
];
export default function GameBoard({
  id,
  playAgain,
}: {
  id: number | null;
  playAgain: () => void;
}) {
  const [roomData, setRoomData] = useState<RoomDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false);
  const [roundScore, setRoundScore] = useState<number>(0);
  const [enemyScore, setEnemyScore] = useState<number>(0);
  const router = useRouter();
  const [dialogWinOrLose, setDialogWinOrLose] = useState<{
    open: boolean;
    win: boolean;
  }>({ open: false, win: false });

  const [images, setImages] = useState<CardImage[] | []>([]);
  const [flipCardLoading, setFlipCardLoading] = useState<boolean>(false);
  const imagesRef = useRef<CardImage[]>([]);

  function seededRandom(seed: number) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function shuffleArray(array: CardImage[], seed: number) {
    let cloneArray = [...array];
    for (let i = cloneArray.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed) * (i + 1));
      [cloneArray[i], cloneArray[j]] = [cloneArray[j], cloneArray[i]]; // Swap
      seed++;
    }
    return cloneArray;
  }

  async function handleFlipCard(index: number) {
    try {
      if (flipCardLoading) {
        toast.warning("Aguarde, estamos carregando sua virada de carta");
        return;
      }

      const { data } = await apiService.get(
        `room/${roomData?.id}/player-allowed-to-play`
      );

      // se não for o player atual, ele é expectador.
      if (!data.content.playerIsAllowed) {
        setFlipCardLoading(false);
        return;
      }

      const flippedImages = images.filter((image) => image.isFlipped);

      if (flippedImages && flippedImages.length === 2) {
        setFlipCardLoading(false);
        return;
      }
      const image = images[index];
      const imageFlipped = flippedImages.find((img) => img.id === image.id);

      // previnir o click na imagem aberta
      if (!image.isMatched && !imageFlipped && images) {
        setFlipCardLoading(true);
        socket.emit("requestFlipCard", {
          roomId: roomData?.id,
          id: image.id,
        });
      }
    } catch (err) {}
  }

  function handleChangedPlayerTurn(playerId: string) {
    try {
      const user = getUserLocal();
      if (!user) return;

      setIsPlayerTurn(playerId === user.id);

      setTimeout(() => {
        const payload = imagesRef.current.map((image) => {
          if (image.isFlipped) image.isFlipped = false;

          return image;
        });

        setImages([...payload]);
      }, 500);
    } catch (err) {}
  }

  async function triggerFlipCard(flippedImages: CardImage[]) {
    const user = getUserLocal();
    if (!user) return;
    // ou seja, selecionou duas imagens iguais.
    const matchPoint =
      flippedImages[0].key === flippedImages[1].key &&
      !flippedImages[0].isMatched &&
      !flippedImages[1].isMatched;

    if (matchPoint) {
      // seta para ficar aberta pra sempre
      // emitir o evento do ponto do jogador
      const payload = imagesRef.current.map((image) => {
        if (image.key === flippedImages[0].key) {
          image.isMatched = true;
          image.isFlipped = false;
        }

        return image;
      });

      setImages([...payload]);

      socket.emit("requestMakePoint", {
        playerId: user.id,
        roomId: id,
      });
    } else {
      socket.emit("requestChangePlayerTurn", {
        roomId: id,
        playerId: user.id,
      });
    }
  }

  function handleFlippedCard(id: number) {
    try {
      // não pode abrir mais de 2 cartas
      const image = imagesRef.current.find((image) => image.id === id);

      if (!image) {
        setFlipCardLoading(false);
        return;
      }

      // atualizando o board
      const newImages = imagesRef.current.map((image) => {
        if (image.id === id) image.isFlipped = true;

        return image;
      });
      setImages([...newImages]);

      const flippedImages = newImages.filter((image) => image.isFlipped);

      if (flippedImages && flippedImages.length === 2) {
        triggerFlipCard(flippedImages);
      }

      setFlipCardLoading(false);
    } catch (err) {}
  }

  function handlePlayAgai() {
    setDialogWinOrLose({
      open: false,
      win: false,
    });
    setImages([]);
    imagesRef.current = [];
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

  function handleMarkedPoint(
    victoryPoint: number,
    scores: { playerId: string; value: number }[]
  ) {
    const user = getUserLocal();
    if (!user) return;
    const winPlayer = scores.find((score) => score.value === victoryPoint);

    if (winPlayer) {
      socket.emit("requestGameWin", {
        roomId: id,
        winnerPlayerId: winPlayer.playerId,
      });
    }

    const roundScore = scores.find((score) => score.playerId === user.id);
    const enemyScore = scores.find((score) => score.playerId !== user.id);

    setRoundScore(roundScore ? roundScore.value : 0);
    setEnemyScore(enemyScore ? enemyScore.value : 0);
  }

  function handleExitGame() {
    setDialogWinOrLose({
      open: false,
      win: false,
    });
    toast.warning("O jogador saiu da sala, entre novamente.");
    router.replace("/room");
  }

  function getImagesToShuffle(level: number) {
    const literal = {
      [LevelEnum.EASY]: [...animal_level_1_imgs],
      [LevelEnum.MEDIUM]: [...animal_level_1_imgs, ...animal_level_2_imgs],
      [LevelEnum.HARD]: [
        ...animal_level_1_imgs,
        ...animal_level_2_imgs,
        ...animal_level_3_imgs,
      ],
    };

    const data = literal[level as LevelEnumType].map((img) => {
      img.isFlipped = false;
      img.isMatched = false;

      return img;
    });

    return data;
  }

  useEffect(() => {
    const fetchRoom = async (roomId: number) => {
      try {
        const { data } = await apiService.get(`room/data/${roomId}`);
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
    if (!roomData || !roomData.level || images.length > 0) return;
    const imagesToShuffle = getImagesToShuffle(roomData.level);

    const shuffledImages = shuffleArray(
      imagesToShuffle,
      roomData.matchRandomNumber
    );
    setImages([...shuffledImages]);
    setLoading(false);
  }, [roomData]);

  useEffect(() => {
    imagesRef.current = images; // Sempre mantém o valor mais recente do estado
  }, [images]);

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
      victoryPoint: number;
      scores: { playerId: string; value: number }[];
    }) => {
      handleMarkedPoint(data.victoryPoint, data.scores);
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
    setImages([]);
  }, []);

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
