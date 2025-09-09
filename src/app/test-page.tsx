"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";

export default function TestPage() {
  const [inputValue, setInputValue] = useState("");
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Component Test Page</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Button Test</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              <Button color="primary">Primary</Button>
              <Button color="secondary">Secondary</Button>
              <Button variant="bordered">Bordered</Button>
              <Button 
                color="success"
                onClick={() => setClickCount(clickCount + 1)}
              >
                Click Count: {clickCount}
              </Button>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              HeroUI buttons support multiple variants and colors. Click the success button to test state management.
            </p>
          </Card>
          
          <Card className="p-6 bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Input Test</h2>
            <div className="space-y-4">
              <Input 
                placeholder="Default input" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input 
                label="Labeled input" 
                placeholder="Enter text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input 
                label="Disabled input" 
                placeholder="This is disabled" 
                isDisabled
              />
            </div>
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Current input value: <span className="font-mono">{inputValue || "(empty)"}</span>
              </p>
            </div>
          </Card>
        </div>
        
        <Card className="p-6 mt-6 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">HeroUI Information</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This page demonstrates HeroUI components imported individually:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Button component from @heroui/button</li>
            <li>Card component from @heroui/card</li>
            <li>Input component from @heroui/input</li>
          </ul>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            You can install additional HeroUI components using npm:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mt-2 text-sm">
            npm install @heroui/[component-name]
          </pre>
        </Card>
      </div>
    </div>
  );
}