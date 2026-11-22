import React, { useState } from 'react';
import { Leaf, Train, Car, Plane, ShieldCheck, Heart, AlertCircle, Info } from 'lucide-react';

export const SustainableTravelPage: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState<number>(695); // default Chennai -> Kochi distance

  // Standard documented emission metrics per passenger-km (g CO2e / p-km)
  // Source: EEA / CPCB rail efficiency benchmarks
  const EMISSIONS = {
    TRAIN: 28, // Electrified passenger train
    CAR: 171,  // Average petrol/diesel passenger car
    FLIGHT: 255, // Domestic short-haul flight (including high-altitude radiative forcing)
  };

  const trainEmissionsKg = ((distanceKm * EMISSIONS.TRAIN) / 1000).toFixed(1);
  const carEmissionsKg = ((distanceKm * EMISSIONS.CAR) / 1000).toFixed(1);
  const flightEmissionsKg = ((distanceKm * EMISSIONS.FLIGHT) / 1000).toFixed(1);
  const carbonSavedKg = (Number(carEmissionsKg) - Number(trainEmissionsKg)).toFixed(1);
  const percentSaved = Math.round(((Number(carEmissionsKg) - Number(trainEmissionsKg)) / Number(carEmissionsKg)) * 100);

  const presets = [
    { name: 'Chennai to Kochi', km: 695 },
    { name: 'Delhi to Agra', km: 195 },
    { name: 'Mumbai to Goa', km: 580 },
    { name: 'Delhi to Jaipur', km: 303 },
    { name: 'Delhi to Mumbai', km: 1385 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <Leaf className="w-3.5 h-3.5" />
          <span>Responsible Tourism & Rail Advocacy</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy-900">
          Travel Better. Leave a Lighter Footprint.
        </h1>
        <p className="text-sm md:text-base text-muted leading-relaxed">
          The future of conscious exploration lies on the tracks. Uniting scenic rail mobility with indigenous cultural stewardship to protect India’s biodiversity.
        </p>
      </div>

      {/* Interactive Carbon Calculator Section */}
      <section id="emissions" className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-ivory-100 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-ivory-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 block">
              Educational Calculator
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900 mt-0.5">
              Comparative Transport Carbon Footprint
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-medium">Quick Routes:</span>
            {presets.slice(0, 3).map((p) => (
              <button
                key={p.name}
                onClick={() => setDistanceKm(p.km)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  distanceKm === p.km
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-ivory-50 text-navy-800 border-ivory-100 hover:bg-ivory-100'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Distance Slider Input */}
        <div className="space-y-3 max-w-xl">
          <div className="flex justify-between items-center text-sm">
            <label className="font-semibold text-navy-900">Journey Distance:</label>
            <span className="font-bold text-emerald-700 text-base">{distanceKm} Kilometers</span>
          </div>
          <input
            type="range"
            min={50}
            max={2500}
            step={25}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full accent-emerald-600 h-2 bg-ivory-100 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-muted">
            <span>50 km (Short Excursion)</span>
            <span>1,200 km (Inter-city)</span>
            <span>2,500 km (Cross-Country)</span>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Train */}
          <div className="bg-emerald-50/60 border-2 border-emerald-500 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Lowest Impact
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
                <Train className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-navy-900">Electric Train</h3>
              <p className="text-xs text-muted mt-1">High-capacity electric passenger locomotive</p>
            </div>
            <div className="pt-4 border-t border-emerald-200">
              <div className="text-3xl font-bold font-serif text-emerald-800">{trainEmissionsKg} kg</div>
              <div className="text-xs text-emerald-700 font-medium">CO2e per passenger</div>
            </div>
          </div>

          {/* Car */}
          <div className="bg-ivory-50 border border-ivory-100 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-navy-800 text-white flex items-center justify-center mb-3">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-navy-900">Standard Road Car</h3>
              <p className="text-xs text-muted mt-1">Single-occupancy internal combustion vehicle</p>
            </div>
            <div className="pt-4 border-t border-ivory-100">
              <div className="text-3xl font-bold font-serif text-navy-900">{carEmissionsKg} kg</div>
              <div className="text-xs text-muted font-medium">CO2e per passenger</div>
            </div>
          </div>

          {/* Flight */}
          <div className="bg-ivory-50 border border-ivory-100 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-navy-800 text-white flex items-center justify-center mb-3">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-navy-900">Domestic Flight</h3>
              <p className="text-xs text-muted mt-1">Short-haul jet aircraft including ascent/descent</p>
            </div>
            <div className="pt-4 border-t border-ivory-100">
              <div className="text-3xl font-bold font-serif text-navy-900">{flightEmissionsKg} kg</div>
              <div className="text-xs text-muted font-medium">CO2e per passenger</div>
            </div>
          </div>
        </div>

        {/* Savings Highlight */}
        <div className="p-4 bg-emerald-100/60 border border-emerald-200 rounded-xl flex items-center justify-between flex-wrap gap-3 text-sm text-emerald-950">
          <div>
            <strong>By choosing the train for this {distanceKm} km journey:</strong> You prevent approximately{' '}
            <span className="font-bold underline text-emerald-800">{carbonSavedKg} kg of CO2e</span> from being released ({percentSaved}% net reduction vs driving).
          </div>
        </div>

        {/* Methodology Disclosure */}
        <div className="p-4 bg-ivory-50 rounded-xl text-xs text-muted leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-navy-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Calculation Method Disclosure:</strong> All emission values are calculated estimates based on standard passenger-kilometer averages (Electrified Passenger Rail: ~28g CO2/p-km; Average Car: ~171g CO2/p-km; Domestic Aviation: ~255g CO2/p-km) derived from published European Environment Agency (EEA) and Central Pollution Control Board (CPCB) transit statistics. Real-world values vary depending on passenger occupancy, electricity grid generation mix, and vehicle class.
          </div>
        </div>
      </section>

      {/* Sustainable Principles Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-3xl font-bold text-navy-900">Five Pillars of AUREVIA Tourism</h2>
          <p className="text-xs text-muted">Actionable commitments embedded into our recommendations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-ivory-100 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="font-serif font-bold text-lg text-navy-900">Electrified Rail Corridors</h3>
            <p className="text-xs text-muted leading-relaxed">
              Prioritize India's rapidly electrifying broad-gauge network. Vande Bharat and Shatabdi trains offer comfortable high-speed travel while minimizing fossil fuel combustion.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-ivory-100 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="font-serif font-bold text-lg text-navy-900">Indigenous Community Support</h3>
            <p className="text-xs text-muted leading-relaxed">
              Channel traveler spending directly into local artisan cooperatives, tribal weaving centers (e.g., Toda embroidery in Nilgiris), and family-run homestays.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-ivory-100 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="font-serif font-bold text-lg text-navy-900">Zero-Waste Mountain Stewardship</h3>
            <p className="text-xs text-muted leading-relaxed">
              Respect strict zero-single-use-plastic zones in fragile high-altitude Western Ghats and Himalayan ecosystems. Carry reusable water filtration bottles.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-ivory-100 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm">
              04
            </div>
            <h3 className="font-serif font-bold text-lg text-navy-900">Cultural & Architectural Preservation</h3>
            <p className="text-xs text-muted leading-relaxed">
              Follow Archeological Survey of India (ASI) heritage preservation guidelines: maintain respectful distances from ancient carvings, avoid touching frescoes, and support monument restoration trusts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-ivory-100 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm">
              05
            </div>
            <h3 className="font-serif font-bold text-lg text-navy-900">Off-Peak & Dispersed Itineraries</h3>
            <p className="text-xs text-muted leading-relaxed">
              Prevent overtourism by visiting heritage monuments during early morning hours and considering shoulder-season travel to distribute economic benefit evenly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
