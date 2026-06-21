import Navbar from "../../components/Navbar";
import Card from "../../components/Card";
import { Button } from "../../components/ui";

export default function DashboardPage() {
  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-40 pb-20">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-semibold text-black dark:text-white">
              Dashboard
            </h1>

            <p className="text-black/50 dark:text-white/50 mt-2">
              Manage your products and generated content.
            </p>
          </div>

          <Button>
            Add Product
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card
            title="Millet Flour"
            description="Organic Himalayan millet flour."
          />

          <Card
            title="Apple Pickle"
            description="Traditional apple pickle."
          />

          <Card
            title="Herbal Tea"
            description="Locally sourced herbal blend."
          />
        </div>
      </main>
    </>
  );
}