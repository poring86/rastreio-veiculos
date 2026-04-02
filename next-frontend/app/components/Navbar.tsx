import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="bg-card border-b border-border py-4 px-8 flex justify-between items-center shadow-sm sticky top-0 z-[2000]">
      <Link href="/" className="flex items-center space-x-2 shrink-0">
        <div className="w-8 h-8 bg-main rounded-lg flex items-center justify-center text-white font-bold text-xl">
            R
        </div>
        <span className="text-xl font-bold text-default tracking-tight">Rastreio<span className="text-main">Veículos</span></span>
      </Link>
      <div className="flex space-x-6 items-center">
        <Link href="/" className="text-muted hover:text-main font-medium transition-colors">
          Início
        </Link>
        <Link href="/new-route" className="text-muted hover:text-main font-medium transition-colors">
          Nova Rota
        </Link>
        <Link href="/driver" className="text-muted hover:text-main font-medium transition-colors">
          Motorista
        </Link>
        <Link href="/admin" className="text-muted hover:text-main font-medium transition-colors">
          Admin
        </Link>
      </div>
    </nav>
  );
};
