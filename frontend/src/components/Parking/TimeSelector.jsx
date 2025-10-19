import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertCircle } from 'lucide-react';
import AnimatedBorder from '../Layout/AnimatedBorder';

const TimeSelector = ({ onTimeSelect, pricePerHour }) => {
  const [duration, setDuration] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [error, setError] = useState('');

  const durations = [1, 2, 3, 4, 5, 6];

  // Initialize with current date and time
  useEffect(() => {
    const now = new Date();
    // Add 1 hour to current time as minimum start time
    now.setHours(now.getHours() + 1);
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    
    setStartDate(dateStr);
    setStartTime(timeStr);
    
    // Initial calculation
    updateTimeSelection(1, dateStr, timeStr);
  }, []);

  const handleDurationChange = (hours) => {
    setDuration(hours);
    updateTimeSelection(hours, startDate, startTime);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setStartDate(date);
    setError('');
    
    // Validate date
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('Please select a future date');
      return;
    }
    
    updateTimeSelection(duration, date, startTime);
  };

  const handleTimeChange = (e) => {
    const time = e.target.value;
    setStartTime(time);
    setError('');
    
    // Validate time if date is today
    if (startDate) {
      const selectedDateTime = new Date(`${startDate}T${time}`);
      const now = new Date();
      
      if (selectedDateTime <= now) {
        setError('Please select a future time');
        return;
      }
    }
    
    updateTimeSelection(duration, startDate, time);
  };

  const updateTimeSelection = (hours, date, time) => {
    if (!date || !time) return;

    try {
      const startDateTime = new Date(`${date}T${time}`);
      const now = new Date();
      
      if (startDateTime <= now) {
        setError('Start time must be in the future');
        return;
      }
      
      const endDateTime = new Date(startDateTime.getTime() + hours * 60 * 60 * 1000);
      const totalPrice = hours * pricePerHour;

      onTimeSelect({
        duration: hours,
        startTime: startDateTime,
        endTime: endDateTime,
        totalPrice,
      });
    } catch (err) {
      console.error('Error updating time selection:', err);
      setError('Invalid date or time selected');
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const year = maxDate.getFullYear();
    const month = String(maxDate.getMonth() + 1).padStart(2, '0');
    const day = String(maxDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format date for display
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (err) {
      return '';
    }
  };

  // Format time for display
  const formatDisplayTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (err) {
      return timeStr;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-silver-light">Select Date & Duration</h2>

      <AnimatedBorder className="bg-dark-card rounded-xl p-6">
        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="block text-silver mb-3 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Select Date</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={handleDateChange}
              min={getMinDate()}
              max={getMaxDate()}
              className="w-full bg-dark-bg border-2 border-dark-border rounded-lg px-4 py-3 text-silver-light focus:outline-none focus:border-silver transition-colors text-base cursor-pointer"
              style={{
                colorScheme: 'dark',
              }}
            />
            {startDate && !error && (
              <p className="mt-2 text-sm text-silver">
                 {formatDisplayDate(startDate)}
              </p>
            )}
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-silver mb-3 flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Select Time</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={handleTimeChange}
              className="w-full bg-dark-bg border-2 border-dark-border rounded-lg px-4 py-3 text-silver-light focus:outline-none focus:border-silver transition-colors text-base cursor-pointer"
              style={{
                colorScheme: 'dark',
              }}
            />
            {startTime && !error && (
              <p className="mt-2 text-sm text-silver">
                 {formatDisplayTime(startTime)}
              </p>
            )}
          </div>

          {/* Duration Selector */}
          <div>
            <label className="block text-silver mb-3 flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Parking Duration</span>
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {durations.map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => handleDurationChange(hours)}
                  className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                    duration === hours
                      ? 'bg-silver border-silver-light text-dark-bg shadow-lg scale-105'
                      : 'bg-dark-bg border-dark-border text-silver hover:border-silver hover:scale-105'
                  }`}
                >
                  {hours}h
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-silver-dark text-center">
              Maximum booking duration: 6 hours
            </p>
          </div>

          {/* Summary */}
          {startDate && startTime && !error && (
            <div className="pt-6 border-t border-dark-border space-y-4">
              <h3 className="text-lg font-semibold text-silver-light mb-3">Booking Summary</h3>
              
              <div className="bg-dark-bg rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <Calendar className="w-4 h-4 text-silver-dark mt-0.5" />
                    <div>
                      <p className="text-xs text-silver-dark">Start Date & Time</p>
                      <p className="text-silver-light font-medium">
                        {formatDisplayDate(startDate)}
                      </p>
                      <p className="text-silver-light font-medium">
                        {formatDisplayTime(startTime)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-dark-border">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-silver-dark" />
                    <span className="text-silver-dark text-sm">Duration</span>
                  </div>
                  <span className="text-silver-light font-medium">
                    {duration} hour{duration > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-silver-dark text-sm">Rate per Hour</span>
                  <span className="text-silver-light font-medium">₹{pricePerHour}</span>
                </div>
              </div>

              <div className="bg-silver/10 rounded-lg p-4 flex items-center justify-between">
                <span className="text-silver font-semibold text-lg">Total Cost:</span>
                <span className="text-3xl font-bold text-silver-light">
                  ₹{duration * pricePerHour}
                </span>
              </div>
            </div>
          )}
        </div>
      </AnimatedBorder>
    </div>
  );
};

export default TimeSelector;