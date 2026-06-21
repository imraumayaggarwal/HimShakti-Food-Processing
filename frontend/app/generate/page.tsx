"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import { Button, Input } from "../../components/ui";

export default function GeneratePage() {
  const [description, setDescription] = useState("");

  return (
    <>
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-40">
        <h1 className="text-5xl font-semibold mb-10">
          AI Description Generator
        </h1>

        <div className="space-y-4">
          <Input
            label="Product Name"
            placeholder="Millet Flour"
          />

          <Input
            label="Ingredients"
            placeholder="Millets"
          />

          <Input
            label="Weight"
            placeholder="500g"
          />

          <Button
            onClick={() =>
              setDescription(
                "Premium Himalayan Millet Flour made from carefully selected grains. Rich in nutrients and ideal for healthy meals."
              )
            }
          >
            Generate Description
          </Button>
        </div>

        {description && (
          <div className="mt-10 border border-black/10 rounded-3xl p-6">
            <h2 className="font-semibold mb-4">
              Generated Description
            </h2>

            <p>{description}</p>
          </div>
        )}
      </main>
    </>
  );
}