"use client";

import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <title>Memory-Game</title>
        <meta
          name="description"
          content="Jogue o Memory Game online contra amigos! Teste sua memória em partidas 1v1, desafie oponentes e divirta-se virando cartas. Simples, rápido e envolvente!"
        />

        <meta property="og:title" content="Memory-Game" />
        <meta
          property="og:description"
          content="Desafie seus amigos em um jogo de memória online 1v1!"
        />
        <meta property="og:image" content="/meta-og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://seusite.com" />
        <meta property="og:type" content="website" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          cross-origin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
