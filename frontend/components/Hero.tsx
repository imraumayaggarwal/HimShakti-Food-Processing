export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#356C4C]/10 blur-3xl" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#4A6FA5]/10 blur-3xl" />

      <div className="max-w-5xl text-center relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-6">
          Food Processing • Artificial Intelligence
        </p>

        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-none text-red-500">
          Helping Local Food Producers
          <br />
          Sell Better Online.
        </h1>

        <p className="max-w-2xl mx-auto mt-8 text-xl text-black/60 dark:text-white/60">
          Generate professional product descriptions,
          marketing content, and product listings for
          food products using AI.
        </p>
      </div>
    </section>
  );
}