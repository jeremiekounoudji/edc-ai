# Libraries Usage Guide

This document provides examples and guidelines for using the libraries included in this project.

## Tailwind CSS

Tailwind CSS is already configured and ready to use. You can use Tailwind classes directly in your components:

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Hello, Tailwind!
</div>
```

## HeroUI

HeroUI components are installed as individual packages. Import components directly from their specific packages:

```tsx
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";

export default function MyComponent() {
  return (
    <Card>
      <h2>HeroUI Card</h2>
      <Input placeholder="Enter text" />
      <Button color="primary">Click me</Button>
    </Card>
  );
}
```

The following HeroUI components are pre-installed in this project:
- `@heroui/button`
- `@heroui/card`
- `@heroui/input`

You can install additional components as needed:
```bash
npm install @heroui/[component-name]
```

## Framer Motion

Framer Motion provides animation capabilities. Import motion components and use animation props:

```tsx
import { motion } from "framer-motion";

export default function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      I'm animated!
    </motion.div>
  );
}
```

## React Icons

React Icons provides popular icon sets as React components. Import the icons you need:

```tsx
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function SocialLinks() {
  return (
    <div className="flex gap-4">
      <FaGithub className="text-2xl" />
      <FaTwitter className="text-2xl text-blue-400" />
      <FaLinkedin className="text-2xl text-blue-700" />
    </div>
  );
}
```

You can browse all available icons at [React Icons](https://react-icons.github.io/react-icons/).