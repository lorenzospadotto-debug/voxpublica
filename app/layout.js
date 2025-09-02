// app/layout.js
import "./globals.css";

export const metadata = {
  title: "VoxPublica",
  description: "Aiuta la comunicazione tra politico e cittadino",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="min-h-screen bg-[#fcf4e4] text-gray-900">
        {children}
      </body>
    </html>
  );
}
