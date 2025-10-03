import { Document, DocumentType } from '../types/documents';

// Mock document data with various file types and realistic information
export const mockDocuments: Document[] = [
  // Invoices
  {
    id: 'doc-001',
    name: 'Invoice_2024_001.pdf',
    type: 'invoice',
    size: 245760, // 240 KB
    uploadDate: new Date('2024-01-15'),
    url: '/downloads/invoice_2024_001.pdf',
    description: 'Monthly service invoice for January 2024'
  },
  {
    id: 'doc-002',
    name: 'Invoice_Acme_Corp_2024.pdf',
    type: 'invoice',
    size: 189440, // 185 KB
    uploadDate: new Date('2024-01-20'),
    url: '/downloads/invoice_acme_corp_2024.pdf',
    description: 'Software licensing invoice from Acme Corporation'
  },
  {
    id: 'doc-003',
    name: 'Invoice_Office_Supplies.pdf',
    type: 'invoice',
    size: 156672, // 153 KB
    uploadDate: new Date('2024-01-25'),
    url: '/downloads/invoice_office_supplies.pdf',
    description: 'Office supplies and equipment invoice'
  },

  // Receipts
  {
    id: 'doc-004',
    name: 'Receipt_Travel_Expenses.pdf',
    type: 'receipt',
    size: 98304, // 96 KB
    uploadDate: new Date('2024-01-10'),
    url: '/downloads/receipt_travel_expenses.pdf',
    description: 'Business travel expense receipt'
  },
  {
    id: 'doc-005',
    name: 'Receipt_Conference_2024.pdf',
    type: 'receipt',
    size: 131072, // 128 KB
    uploadDate: new Date('2024-01-18'),
    url: '/downloads/receipt_conference_2024.pdf',
    description: 'Conference registration and accommodation receipt'
  },
  {
    id: 'doc-006',
    name: 'Receipt_Equipment_Purchase.pdf',
    type: 'receipt',
    size: 204800, // 200 KB
    uploadDate: new Date('2024-01-22'),
    url: '/downloads/receipt_equipment_purchase.pdf',
    description: 'IT equipment purchase receipt'
  },

  // Specifications
  {
    id: 'doc-007',
    name: 'Software_Requirements_Spec.docx',
    type: 'specification',
    size: 524288, // 512 KB
    uploadDate: new Date('2024-01-12'),
    url: '/downloads/software_requirements_spec.docx',
    description: 'Detailed software requirements specification document'
  },
  {
    id: 'doc-008',
    name: 'API_Specification_v2.1.docx',
    type: 'specification',
    size: 393216, // 384 KB
    uploadDate: new Date('2024-01-16'),
    url: '/downloads/api_specification_v2.1.docx',
    description: 'API specification document version 2.1'
  },
  {
    id: 'doc-009',
    name: 'Database_Schema_Spec.docx',
    type: 'specification',
    size: 262144, // 256 KB
    uploadDate: new Date('2024-01-19'),
    url: '/downloads/database_schema_spec.docx',
    description: 'Database schema specification and design'
  },

  // Purchase Orders
  {
    id: 'doc-010',
    name: 'PO_Software_Licenses.xlsx',
    type: 'purchase_order',
    size: 65536, // 64 KB
    uploadDate: new Date('2024-01-14'),
    url: '/downloads/po_software_licenses.xlsx',
    description: 'Purchase order for software licenses'
  },
  {
    id: 'doc-011',
    name: 'PO_Office_Equipment.xlsx',
    type: 'purchase_order',
    size: 81920, // 80 KB
    uploadDate: new Date('2024-01-21'),
    url: '/downloads/po_office_equipment.xlsx',
    description: 'Purchase order for office equipment and furniture'
  },
  {
    id: 'doc-012',
    name: 'PO_Cloud_Services.xlsx',
    type: 'purchase_order',
    size: 73728, // 72 KB
    uploadDate: new Date('2024-01-23'),
    url: '/downloads/po_cloud_services.xlsx',
    description: 'Purchase order for cloud computing services'
  },

  // Contracts
  {
    id: 'doc-013',
    name: 'Service_Contract_Acme.pdf',
    type: 'contract',
    size: 1048576, // 1 MB
    uploadDate: new Date('2024-01-08'),
    url: '/downloads/service_contract_acme.pdf',
    description: 'Service agreement contract with Acme Corporation'
  },
  {
    id: 'doc-014',
    name: 'Employment_Contract_Template.docx',
    type: 'contract',
    size: 327680, // 320 KB
    uploadDate: new Date('2024-01-11'),
    url: '/downloads/employment_contract_template.docx',
    description: 'Standard employment contract template'
  },
  {
    id: 'doc-015',
    name: 'NDA_Template.docx',
    type: 'contract',
    size: 163840, // 160 KB
    uploadDate: new Date('2024-01-17'),
    url: '/downloads/nda_template.docx',
    description: 'Non-disclosure agreement template'
  },

  // Additional documents for testing pagination
  {
    id: 'doc-016',
    name: 'Invoice_Consulting_Services.pdf',
    type: 'invoice',
    size: 196608, // 192 KB
    uploadDate: new Date('2024-01-26'),
    url: '/downloads/invoice_consulting_services.pdf',
    description: 'Consulting services invoice'
  },
  {
    id: 'doc-017',
    name: 'Receipt_Software_Training.pdf',
    type: 'receipt',
    size: 114688, // 112 KB
    uploadDate: new Date('2024-01-27'),
    url: '/downloads/receipt_software_training.pdf',
    description: 'Software training course receipt'
  },
  {
    id: 'doc-018',
    name: 'Technical_Specification_v3.docx',
    type: 'specification',
    size: 458752, // 448 KB
    uploadDate: new Date('2024-01-28'),
    url: '/downloads/technical_specification_v3.docx',
    description: 'Technical specification document version 3.0'
  },
  {
    id: 'doc-019',
    name: 'PO_Marketing_Materials.xlsx',
    type: 'purchase_order',
    size: 90112, // 88 KB
    uploadDate: new Date('2024-01-29'),
    url: '/downloads/po_marketing_materials.xlsx',
    description: 'Purchase order for marketing materials'
  },
  {
    id: 'doc-020',
    name: 'Vendor_Agreement_Template.docx',
    type: 'contract',
    size: 245760, // 240 KB
    uploadDate: new Date('2024-01-30'),
    url: '/downloads/vendor_agreement_template.docx',
    description: 'Vendor agreement contract template'
  },
  {
    id: 'doc-021',
    name: 'Invoice_Maintenance_Contract.pdf',
    type: 'invoice',
    size: 172032, // 168 KB
    uploadDate: new Date('2024-01-31'),
    url: '/downloads/invoice_maintenance_contract.pdf',
    description: 'Annual maintenance contract invoice'
  }
];

// Helper function to get documents by type
export const getDocumentsByType = (type: DocumentType): Document[] => {
  return mockDocuments.filter(doc => doc.type === type);
};

// Helper function to get all document types
export const getDocumentTypes = (): DocumentType[] => {
  return ['invoice', 'receipt', 'specification', 'purchase_order', 'contract'];
};

// Helper function to get document type labels
export const getDocumentTypeLabels = (): Record<DocumentType, string> => {
  return {
    invoice: 'Invoices',
    receipt: 'Receipts',
    specification: 'Specifications',
    purchase_order: 'Purchase Orders',
    contract: 'Contracts'
  };
};
