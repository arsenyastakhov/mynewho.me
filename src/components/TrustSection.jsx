import React from 'react';
import { motion } from 'framer-motion';
import { Home as HomeIcon, Shield, Clock, Users } from 'lucide-react';
import './TrustSection.css';

const benefits = [
  {
    icon: <HomeIcon size={28} />,
    title: "New & Modern Builds",
    desc: "Experience pristine finishes, open floor plans, and energy-efficient designs."
  },
  {
    icon: <Users size={28} />,
    title: "Family-Centric Neighborhoods",
    desc: "Located in the safest, most desirable areas of Punta Gorda and Port Charlotte."
  },
  {
    icon: <Clock size={28} />,
    title: "Lightning-Fast Approvals",
    desc: "Don't wait weeks. Our streamlined application process gets you answers in 24 hours."
  },
  {
    icon: <Shield size={28} />,
    title: "Professional Management",
    desc: "Responsive maintenance and a dedicated portal make renting totally stress-free."
  }
];

const TrustSection = () => {
  return (
    <section className="section bg-secondary" id="benefits">
      <div className="container">
        
        <div className="trust-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why rent with MyNewHome?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            We believe your rental should feel like your forever home.
          </motion.p>
        </div>

        <div className="benefits-grid">
          {benefits.map((item, idx) => (
            <motion.div 
              key={idx}
              className="benefit-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="benefit-icon">
                {item.icon}
              </div>
              <h3 className="benefit-title">{item.title}</h3>
              <p className="benefit-desc">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="cta-banner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Ready to move in?</h2>
          <button className="btn-primary" onClick={() => window.open('https://my.innago.com/a/M2FX7knC5e7', '_blank', 'noopener,noreferrer')}>
            Apply Now
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default TrustSection;
