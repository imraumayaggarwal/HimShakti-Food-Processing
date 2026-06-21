"use client";

import Navbar from "../../components/Navbar";
import { Button, Input } from "../../components/ui";

export default function LoginPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-4xl font-semibold">
            Login
          </h1>

          <Input
            label="Email"
            placeholder="Enter email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
          />

          <Button>
            Login
          </Button>
        </div>
      </main>
    </>
  );
}