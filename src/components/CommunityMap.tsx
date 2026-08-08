import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { CommunityReport } from '../types';
import { AlertTriangle, ThumbsUp, ThumbsDown, ShieldAlert, MapPin, Plus, Camera, Check, X } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

// Fix Leaflet default marker icons for React bundlers
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface CommunityMapProps {
  reports: CommunityReport[];
  onAddReport: (report: Omit<CommunityReport, 'id' | 'createdAt' | 'confirmations' | 'disagreements' | 'isVerified'>) => void;
  onVote: (id: string, type: 'confirm' | 'disagree') => void;
}

// Subcomponent to handle map click for placing a new report pin
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export const CommunityMap: React.FC<CommunityMapProps> = ({ reports, onAddReport, onVote }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isAddingReport, setIsAddingReport] = useState(false);

  // Form state for new report submission
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('PUBLIC SAFETY');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [locationName, setLocationName] = useState('');
  const [reporterName, setReporterName] = useState('');

  // Default map center (Abuja, Nigeria)
  const defaultCenter: [number, number] = [9.0765, 7.3986];

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    setIsAddingReport(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedLocation) {
      alert('Please select a location on the map and enter a title.');
      return;
    }

    onAddReport({
      title,
      description,
      category,
      severity,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      locationName: locationName || 'Local Community Location',
      reporterName: reporterName || 'Anonymous Resident'
    });

    // Reset form
    setTitle('');
    setDescription('');
    setIsAddingReport(false);
    setSelectedLocation(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold uppercase tracking-wider block">COMMUNITY REPORT MAP</span>
            <span>Reports are crowdsourced from residents and local watchers. Reported by community — not independently verified.</span>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedLocation({ lat: 9.0765, lng: 7.3986 });
            setLocationName('Abuja Central Area');
            setIsAddingReport(true);
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 shrink-0 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Report a Hazard</span>
        </button>
      </div>

      {/* Main Map Frame */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl h-[500px] z-10">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onLocationSelect={handleMapClick} />

          {/* Render Pin Markers */}
          {reports.map((report) => (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={customMarkerIcon}
            >
              <Popup className="custom-popup">
                <div className="p-2 space-y-2 min-w-[240px]">
                  <div className="flex items-center justify-between gap-2 border-b pb-1">
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      COMMUNITY REPORT
                    </span>
                    <span className="text-[10px] text-gray-500">{report.category}</span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900 leading-tight">
                    {report.title}
                  </h4>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="text-[11px] text-gray-500 font-medium">
                    📍 {report.locationName}
                  </div>

                  {/* Confirmation votes */}
                  <div className="flex items-center justify-between pt-2 border-t mt-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onVote(report.id, 'confirm')}
                        className="flex items-center space-x-1 px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Confirm ({report.confirmations})</span>
                      </button>

                      <button
                        onClick={() => onVote(report.id, 'disagree')}
                        className="flex items-center space-x-1 px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold"
                      >
                        <ThumbsDown className="w-3 h-3" />
                        <span>Disagree ({report.disagreements})</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-400 italic pt-1">
                    Reported by {report.reporterName} — not independently verified
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* New Selected Pin Marker */}
          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={customMarkerIcon}
            >
              <Popup>
                <div className="p-1 text-xs font-bold text-blue-600">
                  Selected Hazard Location
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Report Modal / Form */}
      {isAddingReport && selectedLocation && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Submit Community Hazard Report
            </h3>
            <button
              onClick={() => setIsAddingReport(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Hazard Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Broken streetlight & exposed conduit"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
                >
                  <option value="PUBLIC SAFETY">PUBLIC SAFETY</option>
                  <option value="ENERGY">ENERGY / ELECTRICAL</option>
                  <option value="TRANSPORT">TRANSPORT / ROAD</option>
                  <option value="ENVIRONMENT">ENVIRONMENT / FLOOD</option>
                  <option value="HOUSING">HOUSING / BUILDING</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you observed, potential danger to pedestrians or vehicles..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location Name</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Street name or neighborhood"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Name / Handle</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Optional resident alias"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-400">
              ⚠️ Note: Your report will be published as a <span className="text-amber-400 font-bold">COMMUNITY REPORT</span>. It will not be marked as independently verified fact.
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingReport(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/20"
              >
                Publish Community Report
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
