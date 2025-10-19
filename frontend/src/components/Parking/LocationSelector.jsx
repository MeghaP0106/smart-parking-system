import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import AnimatedBorder from '../Layout/AnimatedBorder';
import { getLocationsWithinRadius, getAllLocations } from '../../services/api';

const LocationSelector = ({ onLocationSelect }) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    loadAllLocations();
  }, []);

  const loadAllLocations = async () => {
    setLoading(true);
    try {
      const data = await getAllLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserCoords(coords);
          setUseCurrentLocation(true);

          try {
            const nearbyLocations = await getLocationsWithinRadius(
              coords.latitude,
              coords.longitude,
              5
            );
            setLocations(nearbyLocations);
          } catch (error) {
            console.error('Error loading nearby locations:', error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Showing all locations.');
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-silver-light">Select Parking Location</h2>
        <button
          onClick={handleUseCurrentLocation}
          disabled={loading || useCurrentLocation}
          className="flex items-center space-x-2 px-4 py-2 bg-dark-card border border-dark-border rounded-lg hover:border-silver transition-colors disabled:opacity-50"
        >
          <Navigation className="w-4 h-4" />
          <span>{useCurrentLocation ? 'Using Current Location' : 'Use My Location'}</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-silver">Loading locations...</div>
      ) : locations.length === 0 ? (
        <div className="text-center py-12 text-silver-dark">
          No parking locations available within 5km
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <button
              key={location._id}
              onClick={() => handleLocationSelect(location)}
              className="text-left w-full"
            >
              <AnimatedBorder
                className={`bg-dark-card rounded-lg p-6 cursor-pointer transition-all h-full ${
                  selectedLocation?._id === location._id
                    ? 'ring-2 ring-silver bg-dark-border'
                    : 'border border-dark-border hover:border-silver'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-silver flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-silver-light mb-1">
                      {location.name}
                    </h3>
                    <p className="text-sm text-silver-dark mb-2">{location.address}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-silver">
                        {location.availableSlots}/{location.totalSlots} available
                      </span>
                      {location.distance && (
                        <span className="text-silver-dark">{location.distance.toFixed(1)} km</span>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedBorder>
            </button>
          ))}
        </div>
      )}

      {selectedLocation && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-green-400">
            Selected: <span className="font-semibold">{selectedLocation.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;