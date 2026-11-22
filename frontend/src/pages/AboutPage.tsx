import React from 'react';
import { Compass, Train, ShieldCheck, Cpu, Database, Network, GitBranch, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest font-semibold text-gold-600">
          The Story of AUREVIA
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy-900">
          Bridging Tourism, Cultural Heritage, and Sustainable Rail
        </h1>
        <p className="text-base text-muted leading-relaxed">
          A final-year engineering capstone project engineered with an event-driven microservices architecture to provide an integrated travel platform.
        </p>
      </div>

      {/* Vision & Problem Statement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 bg-white p-8 rounded-3xl border border-ivory-100 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-navy-900">The Problem</h2>
          <p className="text-sm text-navy-800/80 leading-relaxed">
            Modern travelers often struggle across fragmented web platforms: booking trains on one portal, searching tourist sights on another, consulting blog guides for cultural monuments, and managing itineraries on separate note apps.
          </p>
          <p className="text-sm text-navy-800/80 leading-relaxed">
            Furthermore, rapid automotive expansion leads to escalating transport emissions and uncoordinated tourist crowding in delicate mountain and historical corridors.
          </p>
        </div>

        <div className="space-y-4 bg-navy-900 text-white p-8 rounded-3xl shadow-md">
          <h2 className="font-serif text-2xl font-bold text-gold-400">The AUREVIA Solution</h2>
          <p className="text-sm text-ivory-100/80 leading-relaxed">
            AUREVIA consolidates travel exploration into one seamless platform: discover Indian destinations, verify nearby UNESCO heritage landmarks, book simulated high-speed trains, receive rule-based recommendations, and organize daily timeline itineraries.
          </p>
          <p className="text-sm text-ivory-100/80 leading-relaxed">
            Underneath, independent microservices communicate asynchronously via RabbitMQ events and transactional outbox patterns to guarantee reliability and scalability.
          </p>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-emerald-600">
            System Design & Technology
          </span>
          <h2 className="font-serif text-3xl font-bold text-navy-900">Event-Driven Microservices Architecture</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-ivory-100 shadow-sm space-y-3">
            <Network className="w-8 h-8 text-emerald-600" />
            <h3 className="font-serif font-bold text-lg text-navy-900">API Gateway</h3>
            <p className="text-xs text-muted leading-relaxed">
              Unified reverse proxy on Port 5000 managing rate limiting, JWT token verification, routing, and aggregated administrative metrics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-ivory-100 shadow-sm space-y-3">
            <Cpu className="w-8 h-8 text-gold-500" />
            <h3 className="font-serif font-bold text-lg text-navy-900">RabbitMQ Message Broker</h3>
            <p className="text-xs text-muted leading-relaxed">
              Decoupled topic exchanges, durable queues, and persistent message routing for BookingConfirmed, BookingCancelled, and UserRegistered events.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-ivory-100 shadow-sm space-y-3">
            <Database className="w-8 h-8 text-navy-700" />
            <h3 className="font-serif font-bold text-lg text-navy-900">Isolated Data Stores</h3>
            <p className="text-xs text-muted leading-relaxed">
              Strict database-per-service boundaries ensuring zero cross-service table joins and enforcing transactional outbox patterns.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-ivory-100 shadow-sm space-y-3">
            <ShieldCheck className="w-8 h-8 text-emerald-700" />
            <h3 className="font-serif font-bold text-lg text-navy-900">Enterprise Security</h3>
            <p className="text-xs text-muted leading-relaxed">
              JWT access tokens, salted bcrypt password hashes, Zod request validation schemas, and role-based access control (USER & ADMIN).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
