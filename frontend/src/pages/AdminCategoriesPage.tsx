import React from 'react';
import { Layers, Mountain, Building2, Landmark, TreePine, Waves, Compass } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const categories = [
    { name: 'Nature', description: 'Hill stations, tea plantations, and scenic Western Ghats corridors.', count: 3, icon: Mountain, color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Historical', description: 'Centuries-old royal palaces, hilltop forts, and Rajput architecture.', count: 3, icon: Building2, color: 'text-gold-600 bg-gold-50' },
    { name: 'Cultural', description: 'Temple architecture, classical dance forms, silk weaving, and spiritual ghats.', count: 2, icon: Landmark, color: 'text-purple-600 bg-purple-50' },
    { name: 'Beach', description: 'Arabian Sea coastal havens, colonial spice plantations, and water sports.', count: 1, icon: Waves, color: 'text-blue-600 bg-blue-50' },
    { name: 'Adventure', description: 'High-altitude Himalayan trekking, Solang Valley winter sports, and mountain passes.', count: 1, icon: Compass, color: 'text-amber-600 bg-amber-50' },
    { name: 'Wildlife', description: 'Protected national parks, endangered Nilgiri Tahr sanctuaries, and tiger reserves.', count: 1, icon: TreePine, color: 'text-emerald-700 bg-emerald-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-ivory-100">
        <h1 className="font-serif text-3xl font-bold text-navy-900">Tourism Categories</h1>
        <p className="text-xs text-muted mt-1">
          Thematic classifications powering rule-based recommendation matching and search filters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className="bg-white p-6 rounded-3xl border border-ivory-100 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-navy-900 bg-ivory-50 px-2.5 py-1 rounded-full border border-ivory-100">
                  {cat.count} Destinations
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-xl text-navy-900">{cat.name}</h3>
                <p className="text-xs text-muted mt-1.5 leading-relaxed">{cat.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
