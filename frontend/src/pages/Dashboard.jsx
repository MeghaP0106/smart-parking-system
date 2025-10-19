import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MapPin, Clock } from 'lucide-react';
import AnimatedBorder from '../components/Layout/AnimatedBorder';
import Navbar from '../components/Layout/Navbar';
import { getUserReservations } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await getUserReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-900/20 border-green-700 text-green-400';
      case 'completed':
        return 'bg-gray-900/20 border-gray-700 text-gray-400';
      case 'cancelled':
        return 'bg-red-900/20 border-red-700 text-red-400';
      default:
        return 'bg-dark-border border-dark-border text-silver';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-silver-light mb-2">My Dashboard</h1>
            <p className="text-silver">Manage your parking reservations</p>
          </div>
          <button
            onClick={() => navigate('/reserve')}
            className="flex items-center space-x-2 bg-silver text-dark-bg px-6 py-3 rounded-lg font-semibold hover:bg-silver-light transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Reservation</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-silver">Loading reservations...</div>
        ) : reservations.length === 0 ? (
          <AnimatedBorder className="bg-dark-card rounded-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-silver-dark mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-silver-light mb-2">
              No Reservations Yet
            </h3>
            <p className="text-silver-dark mb-6">
              Start by making your first parking reservation
            </p>
            <button
              onClick={() => navigate('/reserve')}
              className="inline-flex items-center space-x-2 bg-silver text-dark-bg px-6 py-3 rounded-lg font-semibold hover:bg-silver-light transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Make a Reservation</span>
            </button>
          </AnimatedBorder>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
              <AnimatedBorder
                key={reservation._id}
                className="bg-dark-card rounded-xl p-6 hover:border-silver transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-silver-light mb-1">
                      {reservation.location.name}
                    </h3>
                    <p className="text-sm text-silver-dark">
                      Slot {reservation.slot.slotNumber}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      reservation.status
                    )}`}
                  >
                    {reservation.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-silver-dark text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{reservation.location.address}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-silver-dark text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(reservation.startTime)}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-silver-dark text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{reservation.duration} hours</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dark-border flex items-center justify-between">
                  <span className="text-silver-dark text-sm">Total Amount</span>
                  <span className="text-xl font-bold text-silver-light">
                    ₹{reservation.totalPrice}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-silver-dark">
                    Reservation ID: {reservation.reservationId}
                  </p>
                </div>
              </AnimatedBorder>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;