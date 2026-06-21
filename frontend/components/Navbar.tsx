import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <nav
        className="
          group
          overflow-hidden

          w-[180px]
          hover:w-[700px]

          transition-all
          duration-500

          rounded-full

          border
          border-black/10
          dark:border-white/10

          bg-white/70
          dark:bg-zinc-900/70

          backdrop-blur-xl

          px-8
          py-4

          flex
          items-center

          shadow-sm
          hover:shadow-lg
        "
      >
        <h1 className="font-semibold whitespace-nowrap tracking-tight">
          HimShakti
        </h1>

        <div
          className="
            ml-auto
            flex
            gap-8

            opacity-0
            translate-x-8

            transition-all
            duration-300
            delay-150

            group-hover:opacity-100
            group-hover:translate-x-0
          "
        >
          <a href="/" className="hover:text-[#356C4C] transition-colors">
            Home
          </a>

          <a href="/about" className="hover:text-[#356C4C] transition-colors">
            About
          </a>

          <a href="/dashboard" className="hover:text-[#356C4C] transition-colors">
            Dashboard
          </a>

          <a href="/login" className="hover:text-[#356C4C] transition-colors">
            Login
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}