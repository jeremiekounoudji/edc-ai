"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaReact, FaGithub, FaTwitter } from "react-icons/fa";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-8">
      <main className="max-w-4xl mx-auto">
        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Next.js Starter Kit
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            With Tailwind CSS, HeroUI, Framer Motion & React Icons
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link 
            href="/test-page"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Component Test Page
          </Link>
        </motion.div>

        {/* Libraries Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Tailwind CSS</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              A utility-first CSS framework for rapidly building custom designs.
            </p>
            <div className="bg-blue-500 text-white p-4 rounded-lg">
              Tailwind CSS example
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Framer Motion</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              A production-ready motion library for React.
            </p>
            <motion.div
              className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mx-auto"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>
        </motion.div>

        {/* React Icons Demo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center py-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">React Icons</h2>
          <div className="flex justify-center gap-8 text-4xl">
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <FaReact className="text-blue-500" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <FaGithub className="text-gray-800 dark:text-white" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <FaTwitter className="text-blue-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* HeroUI Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">HeroUI</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Beautiful, fast and modern React UI library built on top of Tailwind CSS.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            HeroUI components have been installed and can be imported individually:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mt-4 text-sm">
            {`import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";`}
          </pre>
          <div className="mt-4">
            <Link 
              href="/test-page"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View Component Test Page →
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center py-8 text-gray-600 dark:text-gray-400"
        >
          <p>Built with Next.js 14, Tailwind CSS, HeroUI, Framer Motion, and React Icons</p>
        </motion.footer>
      </main>
    </div>
  );
}