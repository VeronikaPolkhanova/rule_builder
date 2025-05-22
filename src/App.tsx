import React from "react";
import { RuleBuilderProvider } from "./context/RuleBuilderContext";
import { RuleBuilder } from "./components/RuleBuilder";
import "./index.css";

function App() {
  return (
    <RuleBuilderProvider>
      <main className="min-h-screen bg-gray-100 py-10">
        <h1 className="text-2xl font-semibold text-center mb-8">
          Rule Builder
        </h1>
        <RuleBuilder />
      </main>
    </RuleBuilderProvider>
  );
}

export default App;
