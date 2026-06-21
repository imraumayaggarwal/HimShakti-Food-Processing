type CardProps = {
  title: string;
  description: string;
};

export default function Card({
  title,
  description,
}: CardProps) {
  return (
    <div
      className="
        bg-white
        dark:bg-zinc-900

        border
        border-black/10
        dark:border-white/10

        rounded-3xl
        p-8

        transition-all
        duration-300

        hover:-translate-y-2
        hover:shadow-xl
      "
    >
      <h3 className="text-2xl font-semibold tracking-tight mb-4">
        {title}
      </h3>

      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        {description}
      </p>
    </div>
  );
}