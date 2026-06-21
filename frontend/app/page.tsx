import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-6">
          Made for products like yours
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {[
            "Millet Flour",
            "Herbal Tea",
            "Pickles",
            "Jam",
            "Honey",
            "Spices",
          ].map((product) => (
            <span
              key={product}
              className="
                px-5
                py-2
                rounded-full
                border
                border-black/10
                dark:border-white/10
                bg-black/[0.02]
                dark:bg-white/5
                text-black/70
                dark:text-white/70
                text-sm
              "
            >
              {product}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="mb-16">
          <h2 className="text-5xl font-semibold tracking-tight text-black dark:text-white">
            Built for modern food industries.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card
            title="AI Description Generation"
            description="Create professional product descriptions instantly from basic product information."
          />
            
          <Card
            title="Marketing Content"
            description="Generate promotional content and product highlights for online marketplaces."
          />
            
          <Card
            title="Product Management"
            description="Manage products and organize generated content from one dashboard."
          />
        </div>
      </section>

      <Footer />
    </>
  );
}