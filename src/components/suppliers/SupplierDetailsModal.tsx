'use client';

import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Divider } from '@heroui/react';
import { FiX, FiGlobe, FiMapPin, FiMail, FiPhone, FiMessageCircle, FiExternalLink, FiStar } from 'react-icons/fi';
import { Supplier } from '../../lib/types/suppliers';
import { formatPhoneNumber } from '../../lib/utils/formatters';

interface SupplierDetailsModalProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
}

interface ScoreJustification {
  category: string;
  score: number;
  reason: string;
}

export function SupplierDetailsModal({ supplier, isOpen, onClose }: SupplierDetailsModalProps) {
  // Mock score justification data - in real app this would come from API
  const getScoreJustifications = (supplier: Supplier): ScoreJustification[] => {
    const baseJustifications = {
      'Construction Masters': [
        {
          category: 'Delivery Time',
          score: 88,
          reason: 'For the last 2 years Construction Masters delivered projects on time to JJK Technology and SoftBank but got late by 2 days for HRI Tech 5 years ago. They got 545 positive comments on Facebook and 15,000 followers.'
        },
        {
          category: 'Quality Control',
          score: 92,
          reason: 'Maintained ISO 9001 certification since 2015. Completed 47 major projects with only 2 minor quality issues reported. Client satisfaction rate of 94% based on 156 reviews.'
        },
        {
          category: 'Safety Record',
          score: 95,
          reason: 'Zero workplace accidents in the past 3 years. OSHA compliance score of 98%. Implemented new safety protocols that reduced incident rate by 40% compared to industry average.'
        },
        {
          category: 'Cost Management',
          score: 78,
          reason: 'Projects completed within budget 78% of the time. Average cost overrun of 8% which is below industry standard of 12%. Recent material price increases affected 3 projects.'
        },
        {
          category: 'Communication',
          score: 85,
          reason: 'Average response time of 2.3 hours for urgent requests. Weekly progress reports sent to all clients. 89% of clients rated communication as excellent or good.'
        }
      ],
      'Training Excellence': [
        {
          category: 'Course Completion Rate',
          score: 91,
          reason: 'For the last 2 years Training Excellence achieved 91% completion rate across all programs. JJK Technology had 100% completion, SoftBank 89%, but HRI Tech had 78% completion 5 years ago. They have 2,340 LinkedIn followers and 445 positive reviews.'
        },
        {
          category: 'Certification Success',
          score: 87,
          reason: '87% of participants pass certification exams on first attempt. Industry average is 72%. Specialized programs for PMP and Six Sigma show 94% success rate.'
        },
        {
          category: 'Instructor Quality',
          score: 93,
          reason: 'All instructors hold advanced degrees and industry certifications. Average instructor rating of 4.7/5.0 based on 1,200+ evaluations. 15 instructors with 10+ years experience.'
        },
        {
          category: 'Technology Integration',
          score: 76,
          reason: 'Implemented virtual training platform in 2023. 76% of courses now available online. Some clients prefer in-person sessions, affecting adoption rate.'
        },
        {
          category: 'Follow-up Support',
          score: 82,
          reason: '82% of participants report improved job performance within 6 months. Post-training surveys show 4.2/5.0 satisfaction rating. 30-day follow-up calls completed for 95% of participants.'
        }
      ],
      'Green Energy Systems': [
        {
          category: 'Installation Efficiency',
          score: 89,
          reason: 'For the last 2 years Green Energy Systems completed installations on schedule for JJK Technology and SoftBank but had 3-day delay for HRI Tech project 5 years ago. They have 8,900 Instagram followers and 1,200 positive Google reviews.'
        },
        {
          category: 'Energy Output',
          score: 94,
          reason: 'Solar installations exceed projected energy output by average of 12%. Wind turbines achieve 96% of rated capacity. Battery storage systems maintain 98% efficiency after 2 years.'
        },
        {
          category: 'Environmental Impact',
          score: 97,
          reason: 'Projects have reduced client carbon footprint by average of 45%. Certified B-Corp with environmental score of 97/100. Offset 2,300 tons of CO2 in 2024.'
        },
        {
          category: 'Maintenance Response',
          score: 85,
          reason: 'Average maintenance response time of 4.2 hours. 24/7 monitoring system alerts for 99.2% of issues. Preventive maintenance schedule reduces downtime by 60%.'
        },
        {
          category: 'Cost Savings',
          score: 88,
          reason: 'Clients report average energy cost reduction of 35%. ROI achieved within 4.2 years vs industry average of 6 years. Financing options available for 90% of projects.'
        }
      ]
    };

    return baseJustifications[supplier.companyName as keyof typeof baseJustifications] || [
      {
        category: 'Performance',
        score: supplier.rating,
        reason: `Overall performance rating of ${supplier.rating}% based on comprehensive evaluation of quality, delivery, communication, and customer satisfaction metrics.`
      }
    ];
  };

  const scoreJustifications = getScoreJustifications(supplier);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'primary';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return '⭐';
    if (score >= 80) return '👍';
    if (score >= 70) return '👌';
    return '⚠️';
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-600">
                      {supplier.companyName.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {supplier.companyName}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Chip
                        size="sm"
                        variant="solid"
                        color="primary"
                        className="text-xs"
                      >
                        {supplier.sector}
                      </Chip>
                      <span className="text-sm text-muted-foreground">
                        {supplier.domain}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <FiX className="h-4 w-4" />
                </Button>
              </div>
            </ModalHeader>

            <ModalBody className="py-6">
              <div className="space-y-6">
                {/* Company Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Company Overview</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {supplier.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {supplier.establishedYear && (
                        <div className="flex items-center gap-2 text-sm">
                          <FiGlobe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Established:</span>
                          <span className="font-medium text-foreground">{supplier.establishedYear}</span>
                        </div>
                      )}
                      
                      {supplier.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <FiMapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium text-foreground">
                            {supplier.address.city}, {supplier.address.country}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <FiMail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium text-foreground">{supplier.contact.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <FiPhone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium text-foreground">
                        {formatPhoneNumber(supplier.contact.phone)}
                      </span>
                    </div>
                    
                    {supplier.contact.whatsapp && (
                      <div className="flex items-center gap-3 text-sm">
                        <FiMessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">WhatsApp:</span>
                        <span className="font-medium text-foreground">
                          {formatPhoneNumber(supplier.contact.whatsapp)}
                        </span>
                      </div>
                    )}
                    
                    {supplier.website && (
                      <div className="flex items-center gap-3 text-sm">
                        <FiExternalLink className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Website:</span>
                        <a 
                          href={supplier.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:text-primary-600 transition-colors"
                        >
                          {supplier.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <Divider />

                {/* Overall Score */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Overall Performance Score</h3>
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground">
                        {supplier.rating}%
                      </div>
                      <div className="text-xs text-muted-foreground">Overall Score</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-foreground">Performance Level:</span>
                        <Chip
                          size="sm"
                          variant="solid"
                          color={getScoreColor(supplier.rating)}
                          className="text-xs"
                        >
                          {supplier.rating >= 90 ? 'Excellent' : 
                           supplier.rating >= 80 ? 'Good' : 
                           supplier.rating >= 70 ? 'Satisfactory' : 'Needs Improvement'}
                        </Chip>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            supplier.rating >= 90 ? 'bg-success' :
                            supplier.rating >= 80 ? 'bg-primary' :
                            supplier.rating >= 70 ? 'bg-warning' : 'bg-danger'
                          }`}
                          style={{ width: `${supplier.rating}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Score Justification */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Score Breakdown & Justification</h3>
                  <div className="space-y-4">
                    {scoreJustifications.map((justification, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <h4 className="font-medium text-foreground mb-2">
                          {justification.category}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {justification.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button 
                color="primary" 
                variant="light" 
                onPress={onClose}
                className="font-medium"
              >
                Close
              </Button>
              <Button 
                color="primary" 
                onPress={onClose}
                className="font-medium"
              >
                Contact Supplier
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
