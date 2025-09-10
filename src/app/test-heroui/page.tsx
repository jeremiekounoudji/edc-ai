'use client';

import React from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Spinner } from '@heroui/spinner';

export default function TestHeroUIPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">HeroUI Components Test</h1>
        
        {/* Button Variants Test */}
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold">Button Variants & Colors</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button color="primary" variant="solid">Primary Solid</Button>
              <Button color="primary" variant="bordered">Primary Bordered</Button>
              <Button color="primary" variant="light">Primary Light</Button>
              <Button color="primary" variant="flat">Primary Flat</Button>
              <Button color="primary" variant="faded">Primary Faded</Button>
              <Button color="primary" variant="ghost">Primary Ghost</Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button color="secondary" variant="solid">Secondary Solid</Button>
              <Button color="secondary" variant="bordered">Secondary Bordered</Button>
              <Button color="secondary" variant="light">Secondary Light</Button>
              <Button color="secondary" variant="flat">Secondary Flat</Button>
              <Button color="secondary" variant="faded">Secondary Faded</Button>
              <Button color="secondary" variant="ghost">Secondary Ghost</Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button color="success" variant="solid">Success Solid</Button>
              <Button color="warning" variant="solid">Warning Solid</Button>
              <Button color="danger" variant="solid">Danger Solid</Button>
            </div>
            
            <div className="flex gap-4 items-center">
              <Button color="primary" size="sm">Small</Button>
              <Button color="primary" size="md">Medium</Button>
              <Button color="primary" size="lg">Large</Button>
            </div>
            
            <div className="flex gap-4 items-center">
              <Button color="primary" isLoading>
                <Spinner size="sm" className="mr-2" />
                Loading
              </Button>
              <Button color="primary" disabled>Disabled</Button>
            </div>
          </CardBody>
        </Card>

        {/* Input Variants Test */}
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold">Input Variants</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Outline Input" 
                variant="outline" 
                placeholder="Outline variant" 
              />
              <Input 
                label="Solid Input" 
                variant="solid" 
                placeholder="Solid variant" 
              />
              <Input 
                label="Bordered Input" 
                variant="bordered" 
                placeholder="Bordered variant" 
              />
              <Input 
                label="Underlined Input" 
                variant="underlined" 
                placeholder="Underlined variant" 
              />
              <Input 
                label="Faded Input" 
                variant="faded" 
                placeholder="Faded variant" 
              />
              <Input 
                label="Ghost Input" 
                variant="ghost" 
                placeholder="Ghost variant" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Primary Color" 
                color="primary" 
                variant="bordered" 
                placeholder="Primary color" 
              />
              <Input 
                label="Secondary Color" 
                color="secondary" 
                variant="bordered" 
                placeholder="Secondary color" 
              />
              <Input 
                label="Success Color" 
                color="success" 
                variant="bordered" 
                placeholder="Success color" 
              />
              <Input 
                label="Warning Color" 
                color="warning" 
                variant="bordered" 
                placeholder="Warning color" 
              />
              <Input 
                label="Danger Color" 
                color="danger" 
                variant="bordered" 
                placeholder="Danger color" 
              />
              <Input 
                label="Default Color" 
                color="default" 
                variant="bordered" 
                placeholder="Default color" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Small Size" 
                size="sm" 
                variant="bordered" 
                placeholder="Small size" 
              />
              <Input 
                label="Medium Size" 
                size="md" 
                variant="bordered" 
                placeholder="Medium size" 
              />
              <Input 
                label="Large Size" 
                size="lg" 
                variant="bordered" 
                placeholder="Large size" 
              />
              <Input 
                label="Invalid Input" 
                isInvalid 
                variant="bordered" 
                errorMessage="This is an error message" 
                placeholder="Invalid input" 
              />
            </div>
          </CardBody>
        </Card>

        {/* Select Variants Test */}
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold">Select Variants</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                label="Outline Select" 
                variant="outline" 
                placeholder="Select an option"
              >
                <SelectItem key="1">Option 1</SelectItem>
                <SelectItem key="2">Option 2</SelectItem>
                <SelectItem key="3">Option 3</SelectItem>
              </Select>
              
              <Select 
                label="Solid Select" 
                variant="solid" 
                placeholder="Select an option"
              >
                <SelectItem key="1">Option 1</SelectItem>
                <SelectItem key="2">Option 2</SelectItem>
                <SelectItem key="3">Option 3</SelectItem>
              </Select>
              
              <Select 
                label="Bordered Select" 
                variant="bordered" 
                placeholder="Select an option"
              >
                <SelectItem key="1">Option 1</SelectItem>
                <SelectItem key="2">Option 2</SelectItem>
                <SelectItem key="3">Option 3</SelectItem>
              </Select>
              
              <Select 
                label="Underlined Select" 
                variant="underlined" 
                placeholder="Select an option"
              >
                <SelectItem key="1">Option 1</SelectItem>
                <SelectItem key="2">Option 2</SelectItem>
                <SelectItem key="3">Option 3</SelectItem>
              </Select>
              
              <Select 
                label="Faded Select" 
                variant="faded" 
                placeholder="Select an option"
              >
                <SelectItem key="1">Option 1</SelectItem>
                <SelectItem key="2">Option 2</SelectItem>
                <SelectItem key="3">Option 3</SelectItem>
              </Select>
              
              <Select 
                label="Ghost Select" 
                variant="ghost" 
                placeholder="Select an option"
              >
                <SelectItem key="1">Option 1</SelectItem>
                <SelectItem key="2">Option 2</SelectItem>
                <SelectItem key="3">Option 3</SelectItem>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                label="Primary Color" 
                color="primary" 
                variant="bordered" 
                placeholder="Select an option"
              >
                <SelectItem key="1">Option 1</SelectItem>
                <SelectItem key="2">Option 2</SelectItem>
                <SelectItem key="3">Option 3</SelectItem>
              </Select>
              
              <Select 
                label="Secondary Color" 
                color="secondary" 
                variant="bordered" 
                placeholder="Select an option"
              >
                <SelectItem key="1">Option 1</SelectItem>
                <SelectItem key="2">Option 2</SelectItem>
                <SelectItem key="3">Option 3</SelectItem>
              </Select>
              
              <Select 
                label="Success Color" 
                color="success" 
                variant="bordered" 
                placeholder="Select an option"
              >
                <SelectItem key="1">Option 1</SelectItem>
                <SelectItem key="2">Option 2</SelectItem>
                <SelectItem key="3">Option 3</SelectItem>
              </Select>
              
              <Select 
                label="Warning Color" 
                color="warning" 
                variant="bordered" 
                placeholder="Select an option"
              >
                <SelectItem key="1">Option 1</SelectItem>
                <SelectItem key="2">Option 2</SelectItem>
                <SelectItem key="3">Option 3</SelectItem>
              </Select>
              
              <Select 
                label="Danger Color" 
                color="danger" 
                variant="bordered" 
                placeholder="Select an option"
              >
                <SelectItem key="1">Option 1</SelectItem>
                <SelectItem key="2">Option 2</SelectItem>
                <SelectItem key="3">Option 3</SelectItem>
              </Select>
              
              <Select 
                label="Default Color" 
                color="default" 
                variant="bordered" 
                placeholder="Select an option"
              >
                <SelectItem key="1">Option 1</SelectItem>
                <SelectItem key="2">Option 2</SelectItem>
                <SelectItem key="3">Option 3</SelectItem>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Card Variants Test */}
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold">Card Variants</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-none bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <h4 className="font-bold text-large text-white">NextUI</h4>
                  <small className="text-default-500 text-white">Beautiful, fast and modern React UI library.</small>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <p className="text-tiny text-white">Make beautiful websites regardless of your design experience.</p>
                </CardBody>
              </Card>
              
              <Card className="max-w-[400px]">
                <CardHeader className="flex gap-3">
                  <div className="flex flex-col">
                    <p className="text-md">NextUI</p>
                    <p className="text-small text-default-500">nextui.org</p>
                  </div>
                </CardHeader>
                <CardBody>
                  <p>Make beautiful websites regardless of your design experience.</p>
                </CardBody>
              </Card>
              
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <h4 className="font-bold text-large">Primary Card</h4>
                </CardHeader>
                <CardBody>
                  <p>This is a primary colored card.</p>
                </CardBody>
              </Card>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
