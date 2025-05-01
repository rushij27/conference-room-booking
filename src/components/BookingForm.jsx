import React, { useState, useEffect } from 'react';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../hooks/useAuth';

const BookingForm = ({ booking, roomId, date, onClose }) => {
  const { 
    rooms, 
    addBooking, 
    updateBooking, 
    deleteBooking,
    getRoomById
  } = useBookings();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    roomId: roomId || '',
    title: '',
    date: date,
    startTime: '08:00',
    endTime: '09:00',
    attendees: 1,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);


  const BUSINESS_HOURS = {
    start: '08:00',
    end: '18:00',
    minDuration: 30, // minimum booking duration in minutes
    maxDuration: 240, // maximum booking duration in minutes (4 hours)
  };

  // Generate time slots for business hours
  useEffect(() => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    setTimeSlots(slots);
  }, []);

  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    if (hours === 12) {
      hours = modifier === 'PM' ? 12 : 0;
    } else {
      hours = modifier === 'PM' ? hours + 12 : hours;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  // Convert 24-hour format to 12-hour format
  const convertTo12Hour = (time24h) => {
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // If editing an existing booking, populate form fields
  useEffect(() => {
    if (booking) {
      setFormData({
        roomId: booking.roomId,
        title: booking.title,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        attendees: booking.attendees,
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'startTime' || name === 'endTime') {
      const time24h = convertTo24Hour(value);
      setFormData(prev => ({
        ...prev,
        [name]: time24h
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'attendees' ? parseInt(value, 10) : value
      }));
    }
    setError(''); // Clear any previous errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic form validation
    if (!formData.roomId) {
      setError('Please select a room');
      return;
    }

    if (!formData.title) {
      setError('Please enter a meeting title');
      return;
    }

    // Validate start time
    if (formData.startTime < BUSINESS_HOURS.start || formData.startTime > BUSINESS_HOURS.end) {
      setError(`Start time must be between ${convertTo12Hour(BUSINESS_HOURS.start)} and ${convertTo12Hour(BUSINESS_HOURS.end)}`);
      return;
    }

    // Validate end time
    if (formData.endTime < BUSINESS_HOURS.start || formData.endTime > BUSINESS_HOURS.end) {
      setError(`End time must be between ${convertTo12Hour(BUSINESS_HOURS.start)} and ${convertTo12Hour(BUSINESS_HOURS.end)}`);
      return;
    }

    // Validate relationship between start and end times
    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time');
      return;
    }

    // Calculate duration
    const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
    const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
    const duration = (endHours - startHours) * 60 + (endMinutes - startMinutes);

    // Validate duration
    if (duration < BUSINESS_HOURS.minDuration) {
      setError(`Booking duration must be at least ${BUSINESS_HOURS.minDuration} minutes`);
      return;
    }

    if (duration > BUSINESS_HOURS.maxDuration) {
      setError(`Booking duration cannot exceed ${BUSINESS_HOURS.maxDuration} minutes`);
      return;
    }

    // Validate room capacity
    const selectedRoom = getRoomById(parseInt(formData.roomId, 10));
    if (formData.attendees > selectedRoom.capacity) {
      setError(`The number of attendees exceeds room capacity (${selectedRoom.capacity} people)`);
      return;
    }

    // Submit form
    const result = booking 
      ? updateBooking({ ...booking, ...formData, roomId: parseInt(formData.roomId, 10) }, currentUser.empId, currentUser.isAdmin)
      : addBooking({ ...formData, roomId: parseInt(formData.roomId, 10) }, currentUser.empId);

    if (result.success) {
      setSuccess(booking ? 'Booking updated!' : 'Booking created!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      const result = deleteBooking(booking.id, currentUser.empId, currentUser.isAdmin);
      if (result.success) {
        setSuccess('Booking deleted!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="booking-form">
      <div className="form-header">
        <h2>{booking ? 'Edit Booking' : 'New Booking'}</h2>
        <div onClick={onClose} className="btn-close">x</div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="roomId">Conference Room</label>
          <select 
            id="roomId" 
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            disabled={booking !== null}
          >
            <option value="">Select a room</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.name} (Capacity: {room.capacity})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Meeting Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter meeting title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <select
              id="startTime"
              name="startTime"
              value={convertTo12Hour(formData.startTime)}
              onChange={handleChange}
              required
            >
              {timeSlots.map(time => (
                <option key={`start-${time}`} value={convertTo12Hour(time)}>
                  {convertTo12Hour(time)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <select
              id="endTime"
              name="endTime"
              value={convertTo12Hour(formData.endTime)}
              onChange={handleChange}
              required
            >
              {timeSlots.map(time => (
                <option key={`end-${time}`} value={convertTo12Hour(time)}>
                  {convertTo12Hour(time)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="attendees">Number of Attendees</label>
          <input
            type="number"
            id="attendees"
            name="attendees"
            value={formData.attendees}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-actions">
          {booking && (
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {booking ? 'Update' : 'Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;