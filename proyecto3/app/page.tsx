import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-5xl">Reportes Sistema de Gestión de Eventos Culturales y Asistencia</h1>
        <Image
          className="dark:invert"
          src="/P3BD.png"
          alt="ERD"
          width={880}
          height={680}
          priority
        />
       </main>
    </div>
  );
}
