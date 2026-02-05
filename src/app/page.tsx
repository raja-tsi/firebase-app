export default function Home() {
  const serverTime = new Date().toISOString();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-5xl font-bold text-white mb-4">
        Hello World! 🌍
      </h1>
      <p className="text-xl text-white/80">
        Powered by Firebase App Hosting + Next.js
      </p>
      <p className="text-sm text-white/60 mt-4">
        Server Time: {serverTime}
      </p>
    </main>
  );
}