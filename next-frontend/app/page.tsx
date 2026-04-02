import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-transparent">
      <div className="z-10 w-full max-w-5xl flex flex-col items-center gap-12 text-center">
        
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-main/10 text-main px-4 py-1.5 rounded-full text-sm font-bold tracking-wider border border-main/20 shadow-sm uppercase">
            Logística em Tempo Real
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-default drop-shadow-sm">
            Gestão de <span className="text-main">Frotas</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted font-medium leading-relaxed">
            Acompanhe suas rotas de entrega com precisão milimétrica. Escolha um painel para monitorar ou criar novos trajetos.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-8">
          
          <Link
            href="/new-route"
            className="group relative flex flex-col items-start gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-2xl hover:border-main/50 hover:-translate-y-1"
          >
            <div className="p-4 rounded-2xl bg-main/10 text-main group-hover:bg-main group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div className="text-left">
              <h2 className="mb-2 text-2xl font-black text-default group-hover:text-main transition-colors">
                Nova Rota
              </h2>
              <p className="text-sm text-muted font-medium leading-relaxed">
                Crie trajetórias inteligentes definindo origem e destino no mapa.
              </p>
            </div>
            <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-main"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </Link>

          <Link
            href="/driver"
            className="group relative flex flex-col items-start gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-2xl hover:border-emerald-500/50 hover:-translate-y-1"
          >
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 3c-.1.2-.1.4-.1.6V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
            </div>
            <div className="text-left">
              <h2 className="mb-2 text-2xl font-black text-default group-hover:text-emerald-500 transition-colors">
                Motorista
              </h2>
              <p className="text-sm text-muted font-medium leading-relaxed">
                Inicie viagens e transmita sua localização ao vivo para o centro.
              </p>
            </div>
            <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </Link>

          <Link
            href="/admin"
            className="group relative flex flex-col items-start gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-2xl hover:border-rose-500/50 hover:-translate-y-1"
          >
            <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="4" rx="2"/><rect width="20" height="8" x="2" y="12" rx="2"/><path d="M6 8h.01"/><path d="M6 16h.01"/></svg>
            </div>
            <div className="text-left">
              <h2 className="mb-2 text-2xl font-black text-default group-hover:text-rose-500 transition-colors">
                Admin
              </h2>
              <p className="text-sm text-muted font-medium leading-relaxed">
                Visualize todas as entregas ativas em um mapa colaborativo ao vivo.
              </p>
            </div>
            <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
