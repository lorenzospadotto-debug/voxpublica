import './globals.css';
import Image from 'next/image';

export const metadata = {
title: 'VoxPublica',
description: 'AI per Uffici Stampa: comunicati, social, dichiarazioni',
};

export default function RootLayout({ children }) {
return (
<html lang="it">
<body>
<header className="bg-[var(--vp-bg)] border-b border-black/5">
<div className="container-narrow flex items-center gap-4 py-4">
<Image src="/logo.png" alt="VoxPublica" width={44} height={44} />
<h1 className="text-2xl font-extrabold" style={{color:'var(--vp-dark)'}}>VoxPublica</h1>
</div>
</header>
{children}
</body>
</html>
);
}
