import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ServiceIcon from './ServiceIcon';
import type { DisplayService } from '../config/servicesCatalog';

interface ServiceFlipCardProps {
  service: DisplayService;
  learnMoreLabel: string;
}

const ServiceFlipCard: React.FC<ServiceFlipCardProps> = ({ service, learnMoreLabel }) => {
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = () => setFlipped((prev) => !prev);

  return (
    <article
      className={`service-flip-card shrink-0 ${flipped ? 'is-flipped' : ''}`}
      aria-label={service.title}
    >
      <div className="service-flip-card-inner">
        <div
          className="service-flip-card-face service-flip-card-front"
          onClick={toggleFlip}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleFlip();
            }
          }}
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
        >
          <img
            src={service.imageUrl}
            alt=""
            className="service-flip-card-image"
            loading="lazy"
            aria-hidden
          />
          <div className="service-flip-card-overlay" aria-hidden />
          <div className="service-flip-card-front-content">
            <ServiceIcon iconKey={service.iconKey} size={30} className="service-flip-card-icon" />
            <h3 className="service-flip-card-title">{service.title}</h3>
          </div>
        </div>
        <div className="service-flip-card-face service-flip-card-back">
          <img
            src={service.imageUrl}
            alt=""
            className="service-flip-card-image service-flip-card-image--blurred"
            loading="lazy"
            aria-hidden
          />
          <div className="service-flip-card-overlay service-flip-card-overlay--back" aria-hidden />
          <div className="service-flip-card-back-content">
            <p className="service-flip-card-description">{service.description}</p>
            <Link
              to="/services"
              className="service-flip-card-learn-more"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {learnMoreLabel} <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ServiceFlipCard;
