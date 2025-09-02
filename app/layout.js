// app/layout.js
import "./globals.css";

export const metadata = {
  title: "VoxPublica",
  description: "Aiuta la comunicazione tra politico e cittadino",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
