import React from 'react';
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';

// This file demonstrates the available HeroUI components and their usage patterns
// These components will be used throughout the application

export const BaseComponents = {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
};

// Example usage patterns for common UI elements
export const ExampleUsage = () => {
  return (
    <div className="space-y-4 p-4">
      {/* Button Examples */}
      <div className="space-x-2">
        <Button color="primary">Primary Button</Button>
        <Button color="secondary">Secondary Button</Button>
        <Button color="success">Success Button</Button>
        <Button color="warning">Warning Button</Button>
        <Button color="danger">Danger Button</Button>
      </div>

      {/* Card Examples */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Card Header</h3>
        </CardHeader>
        <CardBody>
          <p>This is a card body with content.</p>
        </CardBody>
      </Card>

      {/* Input Examples */}
      <Input
        type="text"
        label="Text Input"
        placeholder="Enter text here"
        variant="bordered"
      />
    </div>
  );
};

export default BaseComponents;
