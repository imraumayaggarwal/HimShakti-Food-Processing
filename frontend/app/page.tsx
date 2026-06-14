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
            title="Quality Intelligence"
            description="Detect inconsistencies and maintain high production standards through AI-assisted monitoring."
          />

          <Card
            title="Process Optimization"
            description="Identify bottlenecks and improve operational efficiency across workflows."
          />

          <Card
            title="Predictive Analytics"
            description="Forecast demand patterns and make data-driven decisions with confidence."
          />
        </div>
      </section>

      <Footer />
    </>
  );
}