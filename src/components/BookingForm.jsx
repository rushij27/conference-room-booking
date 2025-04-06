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
    startTime: '09:00',
    endTime: '10:00',
    attendees: 1,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setFormData(prev => ({
      ...prev,
      [name]: name === 'attendees' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate input
    if (!formData.roomId) {
      setError('Please select a room');
      return;
    }

    if (!formData.title) {
      setError('Please enter a meeting title');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time');
      return;
    }

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
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              min="08:00"
              max="17:30"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              min="08:30"
              max="18:00"
              required
            />
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