export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 mt-32">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-semibold text-black dark:text-white">
            HimShakti
          </h3>

          <p className="text-black/50 dark:text-white/50 text-sm">
            AI-Powered Food Processing
          </p>
        </div>

        <div className="flex gap-6 text-black/50 dark:text-white/50">
          <a href="#">GitHub</a>
          <a href="#">LinkedIn</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}