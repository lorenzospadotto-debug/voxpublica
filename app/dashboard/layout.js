import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-60 bg-[#FCE6D9] h-screen flex flex-col">
      <div className="p-4 font-bold text-xl">VoxPublica</div>
      <nav className="flex-1 p-2 space-y-2">
        <Link href="/dashboard" className="block">Dashboard</Link>
        <Link href="/dashboard/ufficio-stampa" className="block">Ufficio Stampa</Link>
        <Link href="/dashboard/bozze" className="block">Bozze</Link>
        <Link href="/aiuto" className="block">Aiuto</Link>
      </nav>
    </aside>
  );
}
