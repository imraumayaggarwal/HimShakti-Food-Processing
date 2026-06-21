import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="mb-16">
          <h2 className="text-5xl font-semibold tracking-tight">
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