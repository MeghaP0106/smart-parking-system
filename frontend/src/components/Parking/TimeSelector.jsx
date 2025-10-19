import React, { useState } from 'react';
import { Clock, Calendar } from 'lucide-react';
import AnimatedBorder from '../Layout/AnimatedBorder';

const TimeSelector = ({ onTimeSelect, pricePerHour }) => {
  const [duration, setDuration] = useState(1);
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    return now.toISOString().slice(0, 16);
  });

  const durations = [1, 2, 3, 4, 5, 6];

  const handleDurationChange = (hours) => {
    setDuration(hours);
    updateTimeSelection(hours, startTime);
  };

  const handleStartTimeChange = (time) => {
    setStartTime(time);
    updateTimeSelection(duration, time);
  };

  const updateTimeSelection = (hours, start) => {
    const startDate = new Date(start);
    const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000);
    const totalPrice = hours * pricePerHour;

    onTimeSelect({
      duration: hours,
      startTime: startDate,
      endTime: endDate,
      totalPrice,
    });
  };

  useState(() => {
    updateTimeSelection(duration, startTime);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-silver-light">Select Duration</h2>

      <AnimatedBorder className="bg-dark-card rounded-xl p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-silver mb-3 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Start Time</span>
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-silver-light focus:outline-none focus:border-silver transition-colors"
            />
          </div>

          <div>
            <label className="block text-silver mb-3 flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Duration (Hours)</span>
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {durations.map((hours) => (
                <button
                  key={hours}
                  onClick={() => handleDurationChange(hours)}
                  className={`py-3 rounded-lg border-2 font-semibold transition-all ${
                    duration === hours
                      ? 'bg-silver border-silver-light text-dark-bg'
                      : 'bg-dark-bg border-dark-border text-silver hover:border-silver'
                  }`}
                >
                  {hours}h
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-dark-border">
            <div className="flex items-center justify-between text-lg">
              <span className="text-silver">Total Cost:</span>
              <span className="text-2xl font-bold text-silver-light">
                ₹{duration * pricePerHour}
              </span>
            </div>
            <p className="text-sm text-silver-dark mt-2">
              {duration} hour{duration > 1 ? 's' : ''} × ₹{pricePerHour}/hour
            </p>
          </div>
        </div>
      </AnimatedBorder>
    </div>
  );
};

export default TimeSelector;