export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">

      <div
        className="
          absolute
          top-0
          left-0

          w-[500px]
          h-[500px]

          rounded-full

          bg-[#356C4C]/10

          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-0
          right-0

          w-[500px]
          h-[500px]

          rounded-full

          bg-[#4A6FA5]/10

          blur-3xl
        "
      />

      <div className="max-w-5xl text-center relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-black/40 mb-6">
          Food Processing • Artificial Intelligence
        </p>

        <h1 className="text-6xl md:text-8xl font-semibold tracking-tight leading-none">
          Food Processing,
          <br />
          Reimagined with Intelligence.
        </h1>

        <p className="max-w-2xl mx-auto mt-8 text-xl text-black/60">
          Helping food manufacturers improve quality,
          reduce waste, and make smarter decisions
          through AI-powered insights.
        </p>

        <div className="flex justify-center gap-4 mt-10">
          <button
            className="
              bg-[#356C4C]
              hover:bg-[#2B563D]

              text-white

              px-7
              py-3

              rounded-full

              transition-all
            "
          >
            Explore Platform
          </button>

          <button
            className="
              border
              border-black/10

              px-7
              py-3

              rounded-full

              hover:bg-black/5

              transition-all
            "
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}