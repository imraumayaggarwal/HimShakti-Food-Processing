import Navbar from "../../components/Navbar";

export default function ProductPage() {
  return (
    <>
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-40">
        <h1 className="text-5xl font-semibold mb-10 text-black dark:text-white">
          Millet Flour
        </h1>

        <div className="border border-black/10 dark:border-white/10 rounded-3xl p-8 space-y-4 text-black dark:text-white">
          <p>
            <strong>Ingredients:</strong> Millets
          </p>

          <p>
            <strong>Weight:</strong> 500g
          </p>

          <p>
            <strong>Description:</strong>
          </p>

          <p>
            Premium Himalayan Millet Flour made from
            carefully selected grains. Rich in nutrients
            and ideal for healthy meals.
          </p>
        </div>
      </main>
    </>
  );
}