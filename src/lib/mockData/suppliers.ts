import { Supplier } from '../types/suppliers';

// Mock supplier data with realistic company information and ratings
export const mockSuppliers: Supplier[] = [
  {
    id: 'supplier-001',
    companyName: 'TechCorp Solutions',
    description: 'Leading provider of enterprise software solutions and IT consulting services. Specializing in cloud migration and digital transformation.',
    sector: 'Technology',
    domain: 'Software Development',
    rating: 87,
    avatar: '/avatars/techcorp-logo.png',
    contact: {
      email: 'contact@techcorp.com',
      phone: '+1-555-0123',
      whatsapp: '+1-555-0123'
    },
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      country: 'USA',
      postalCode: '94105'
    },
    website: 'https://www.techcorp.com',
    establishedYear: 2015
  },
  {
    id: 'supplier-002',
    companyName: 'Global Manufacturing Ltd',
    description: 'International manufacturing company specializing in automotive parts and industrial equipment. ISO 9001 certified with 20+ years of experience.',
    sector: 'Manufacturing',
    domain: 'Automotive Parts',
    rating: 92,
    avatar: '/avatars/global-manufacturing-logo.png',
    contact: {
      email: 'sales@globalmanufacturing.com',
      phone: '+1-555-0456',
      whatsapp: '+1-555-0456'
    },
    address: {
      street: '456 Industrial Blvd',
      city: 'Detroit',
      country: 'USA',
      postalCode: '48201'
    },
    website: 'https://www.globalmanufacturing.com',
    establishedYear: 2003
  },
  {
    id: 'supplier-003',
    companyName: 'Green Energy Systems',
    description: 'Sustainable energy solutions provider offering solar panels, wind turbines, and energy storage systems. Committed to environmental responsibility.',
    sector: 'Energy',
    domain: 'Renewable Energy',
    rating: 78,
    avatar: '/avatars/green-energy-logo.png',
    contact: {
      email: 'info@greenenergy.com',
      phone: '+1-555-0789',
      whatsapp: '+1-555-0789'
    },
    address: {
      street: '789 Renewable Way',
      city: 'Austin',
      country: 'USA',
      postalCode: '73301'
    },
    website: 'https://www.greenenergy.com',
    establishedYear: 2018
  },
  {
    id: 'supplier-004',
    companyName: 'Office Solutions Pro',
    description: 'Complete office supply and furniture solutions. From ergonomic chairs to modern workstations, we provide everything for productive workspaces.',
    sector: 'Office Supplies',
    domain: 'Furniture & Supplies',
    rating: 65,
    avatar: '/avatars/office-solutions-logo.png',
    contact: {
      email: 'orders@officesolutions.com',
      phone: '+1-555-0321',
      whatsapp: '+1-555-0321'
    },
    address: {
      street: '321 Business Park',
      city: 'Chicago',
      country: 'USA',
      postalCode: '60601'
    },
    website: 'https://www.officesolutions.com',
    establishedYear: 2010
  },
  {
    id: 'supplier-005',
    companyName: 'CloudTech Services',
    description: 'Cloud infrastructure and managed services provider. Offering AWS, Azure, and Google Cloud solutions with 24/7 support and monitoring.',
    sector: 'Technology',
    domain: 'Cloud Services',
    rating: 89,
    avatar: '/avatars/cloudtech-logo.png',
    contact: {
      email: 'support@cloudtech.com',
      phone: '+1-555-0654',
      whatsapp: '+1-555-0654'
    },
    address: {
      street: '654 Data Center Dr',
      city: 'Seattle',
      country: 'USA',
      postalCode: '98101'
    },
    website: 'https://www.cloudtech.com',
    establishedYear: 2017
  },
  {
    id: 'supplier-006',
    companyName: 'Marketing Dynamics',
    description: 'Full-service marketing agency specializing in digital marketing, brand development, and content creation. Creative solutions for modern businesses.',
    sector: 'Marketing',
    domain: 'Digital Marketing',
    rating: 73,
    avatar: '/avatars/marketing-dynamics-logo.png',
    contact: {
      email: 'hello@marketingdynamics.com',
      phone: '+1-555-0987',
      whatsapp: '+1-555-0987'
    },
    address: {
      street: '987 Creative Lane',
      city: 'New York',
      country: 'USA',
      postalCode: '10001'
    },
    website: 'https://www.marketingdynamics.com',
    establishedYear: 2012
  },
  {
    id: 'supplier-007',
    companyName: 'SecureIT Solutions',
    description: 'Cybersecurity and IT security services provider. Specializing in network security, data protection, and compliance consulting.',
    sector: 'Technology',
    domain: 'Cybersecurity',
    rating: 95,
    avatar: '/avatars/secureit-logo.png',
    contact: {
      email: 'security@secureit.com',
      phone: '+1-555-0147',
      whatsapp: '+1-555-0147'
    },
    address: {
      street: '147 Security Blvd',
      city: 'Washington',
      country: 'USA',
      postalCode: '20001'
    },
    website: 'https://www.secureit.com',
    establishedYear: 2008
  },
  {
    id: 'supplier-008',
    companyName: 'Logistics Express',
    description: 'International logistics and freight forwarding company. Providing reliable shipping solutions for businesses worldwide with real-time tracking.',
    sector: 'Logistics',
    domain: 'Freight Forwarding',
    rating: 81,
    avatar: '/avatars/logistics-express-logo.png',
    contact: {
      email: 'shipping@logisticsexpress.com',
      phone: '+1-555-0258',
      whatsapp: '+1-555-0258'
    },
    address: {
      street: '258 Cargo Way',
      city: 'Los Angeles',
      country: 'USA',
      postalCode: '90001'
    },
    website: 'https://www.logisticsexpress.com',
    establishedYear: 2005
  },
  {
    id: 'supplier-009',
    companyName: 'Financial Advisory Group',
    description: 'Professional financial consulting and advisory services. Specializing in investment strategies, risk management, and financial planning.',
    sector: 'Finance',
    domain: 'Financial Consulting',
    rating: 88,
    avatar: '/avatars/financial-advisory-logo.png',
    contact: {
      email: 'advisors@financialgroup.com',
      phone: '+1-555-0369',
      whatsapp: '+1-555-0369'
    },
    address: {
      street: '369 Wall Street',
      city: 'New York',
      country: 'USA',
      postalCode: '10005'
    },
    website: 'https://www.financialgroup.com',
    establishedYear: 2000
  },
  {
    id: 'supplier-010',
    companyName: 'Healthcare Innovations',
    description: 'Medical equipment and healthcare technology solutions provider. Committed to improving patient care through innovative medical devices.',
    sector: 'Healthcare',
    domain: 'Medical Equipment',
    rating: 76,
    avatar: '/avatars/healthcare-innovations-logo.png',
    contact: {
      email: 'medical@healthcareinnovations.com',
      phone: '+1-555-0741',
      whatsapp: '+1-555-0741'
    },
    address: {
      street: '741 Medical Center Dr',
      city: 'Boston',
      country: 'USA',
      postalCode: '02101'
    },
    website: 'https://www.healthcareinnovations.com',
    establishedYear: 2014
  },
  {
    id: 'supplier-011',
    companyName: 'Legal Services Pro',
    description: 'Comprehensive legal services including corporate law, contract management, and compliance consulting. Experienced attorneys for all business needs.',
    sector: 'Legal',
    domain: 'Legal Services',
    rating: 84,
    avatar: '/avatars/legal-services-logo.png',
    contact: {
      email: 'legal@legalservicespro.com',
      phone: '+1-555-0852',
      whatsapp: '+1-555-0852'
    },
    address: {
      street: '852 Justice Ave',
      city: 'Philadelphia',
      country: 'USA',
      postalCode: '19101'
    },
    website: 'https://www.legalservicespro.com',
    establishedYear: 2007
  },
  {
    id: 'supplier-012',
    companyName: 'Training Excellence',
    description: 'Professional development and corporate training services. Offering leadership development, technical training, and certification programs.',
    sector: 'Education',
    domain: 'Corporate Training',
    rating: 79,
    avatar: '/avatars/training-excellence-logo.png',
    contact: {
      email: 'training@trainingexcellence.com',
      phone: '+1-555-0963',
      whatsapp: '+1-555-0963'
    },
    address: {
      street: '963 Learning Center',
      city: 'Denver',
      country: 'USA',
      postalCode: '80201'
    },
    website: 'https://www.trainingexcellence.com',
    establishedYear: 2011
  },
  {
    id: 'supplier-013',
    companyName: 'Construction Masters',
    description: 'Commercial and residential construction services. Specializing in office buildings, retail spaces, and custom home construction.',
    sector: 'Construction',
    domain: 'Commercial Construction',
    rating: 71,
    avatar: '/avatars/construction-masters-logo.png',
    contact: {
      email: 'build@constructionmasters.com',
      phone: '+1-555-0074',
      whatsapp: '+1-555-0074'
    },
    address: {
      street: '074 Builder Blvd',
      city: 'Houston',
      country: 'USA',
      postalCode: '77001'
    },
    website: 'https://www.constructionmasters.com',
    establishedYear: 2009
  },
  {
    id: 'supplier-014',
    companyName: 'Food Service Solutions',
    description: 'Commercial food service equipment and supplies provider. From kitchen equipment to restaurant furniture, serving the hospitality industry.',
    sector: 'Food Service',
    domain: 'Restaurant Equipment',
    rating: 68,
    avatar: '/avatars/food-service-logo.png',
    contact: {
      email: 'orders@foodservicesolutions.com',
      phone: '+1-555-0185',
      whatsapp: '+1-555-0185'
    },
    address: {
      street: '185 Kitchen Way',
      city: 'Miami',
      country: 'USA',
      postalCode: '33101'
    },
    website: 'https://www.foodservicesolutions.com',
    establishedYear: 2016
  },
  {
    id: 'supplier-015',
    companyName: 'Transportation Hub',
    description: 'Fleet management and transportation services. Providing vehicle leasing, maintenance, and logistics solutions for businesses.',
    sector: 'Transportation',
    domain: 'Fleet Management',
    rating: 82,
    avatar: '/avatars/transportation-hub-logo.png',
    contact: {
      email: 'fleet@transportationhub.com',
      phone: '+1-555-0296',
      whatsapp: '+1-555-0296'
    },
    address: {
      street: '296 Fleet St',
      city: 'Phoenix',
      country: 'USA',
      postalCode: '85001'
    },
    website: 'https://www.transportationhub.com',
    establishedYear: 2013
  }
];

// Helper function to get suppliers by sector
export const getSuppliersBySector = (sector: string): Supplier[] => {
  return mockSuppliers.filter(supplier => supplier.sector === sector);
};

// Helper function to get all sectors
export const getSectors = (): string[] => {
  const sectors = [...new Set(mockSuppliers.map(supplier => supplier.sector))];
  return sectors.sort();
};

// Helper function to get suppliers by rating range
export const getSuppliersByRating = (minRating: number, maxRating: number): Supplier[] => {
  return mockSuppliers.filter(supplier => supplier.rating >= minRating && supplier.rating <= maxRating);
};

// Helper function to get top rated suppliers
export const getTopRatedSuppliers = (limit: number = 5): Supplier[] => {
  return mockSuppliers
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};
