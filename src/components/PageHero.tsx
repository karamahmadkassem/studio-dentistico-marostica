import React from 'react';
import { motion } from 'framer-motion';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
  compact?: boolean;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  image = 'https://images.pexels.com/photos/3845736/pexels-photo-3845736.jpeg?auto=compress&cs=tinysrgb&w=1600',
  compact = false,
}) => {
  return (
    <section
      className={`relative overflow-hidden ${compact ? 'py-24 md:py-28' : 'py-28 md:py-32'}`}
      style={{ backgroundColor: 'var(--brand-deep)', color: '#ffffff' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(3,13,29,0.9) 0%, rgba(0,3,64,0.86) 50%, rgba(3,13,29,0.94) 100%)',
        }}
        aria-hidden
      />
      <div className="container-page relative z-10 pt-10 text-center">
        <motion.h1
          className="heading-on-dark mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="text-on-dark mx-auto max-w-2xl text-lg md:text-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default PageHero;
