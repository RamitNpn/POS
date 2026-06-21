export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
          alt="USA Flag"
          className="w-64 md:w-96 mb-10 opacity-90 shadow-2xl"
        />

        <h1 className="text-6xl md:text-8xl font-extrabold text-red-600 tracking-widest uppercase animate-pulse">
          HACKED
        </h1>

        <p className="max-w-4xl text-xl md:text-3xl leading-relaxed text-gray-200">
          This website has been compromised.
        </p>

        <div className="mt-12 border border-red-700 bg-red-950/30 backdrop-blur-sm p-8 rounded-lg max-w-3xl w-full">
          <h2 className="text-red-500 text-2xl font-bold mb-4">
            "SAY YES TO MCC & SPP"
          </h2>
        </div>

        <div className="mt-16 font-mono text-green-400 text-sm md:text-base">
          root@server:~# access granted_
          <span className="animate-pulse">|</span>
        </div>
      </div>
    </main>
  );
}