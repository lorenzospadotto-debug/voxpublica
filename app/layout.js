import './globals.css';
import TopHeader from '@/components/TopHeader';

export const metadata = {
  title: 'VoxPublica',
  description: 'AI per comunicati stampa, dichiarazioni e testi social.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="bg-[#FDF9F6] text-[#1F1A17]">
        <TopHeader />
        {children}
      </body>
    </html>
  );
}
