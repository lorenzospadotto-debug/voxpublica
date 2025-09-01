import Link from "next/link";
import { Home, FileText, Archive, HelpCircle } from "lucide-react"; // assicurati che HelpCircle ci sia

export default function Sidebar() {
  return (
    <aside className="w-60 bg-[#FCE6D9] h-screen flex flex-col">
      <div className="p-4 font-bold text-xl">VoxPublica</div>
      <nav className="flex-1 p-2 space-y-2">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Home size={18} /> <span>Dashboard</span>
        </Link>
        <Link href="/dashboard/ufficio-stampa" className="flex items-center space-x-2">
          <FileText size={18} /> <span>Ufficio Stampa</span>
        </Link>
        <Link href="/dashboard/bozze" className="flex items-center space-x-2">
          <Archive size={18} /> <span>Bozze</span>
        </Link>
        <Link href="/dashboard/aiuto" className="flex items-center space-x-2">
          <HelpCircle size={18} /> <span>Aiuto</span>
        </Link>
      </nav>
    </aside>
  );
}
