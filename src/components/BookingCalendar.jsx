import React from 'react';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../hooks/useAuth';

const BookingCalendar = ({ date, onDateChange, selectedRoom, onBookingClick }) => {
  const { getBookingsByDate, getRoomById, formatDate } = useBookings();
  const { currentUser } = useAuth();
  
  // Get all bookings for the selected date
  const dayBookings = getBookingsByDate(date);
  
  // Filter bookings by selected room if one is selected
  const filteredBookings = selectedRoom 
    ? dayBookings.filter(booking => booking.roomId === selectedRoom)
    : dayBookings;

  // Generate time slots for the day (8:00 AM to 6:00 PM)
  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  // Navigate to previous day
  const goToPreviousDay = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    onDateChange(formatDate(currentDate));
  };

  // Navigate to next day
  const goToNextDay = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    onDateChange(formatDate(currentDate));
  };

  // Get room name
  const getRoomName = (roomId) => {
    const room = getRoomById(roomId);
    return room ? room.name : 'Unknown Room';
  };

  // Format time for display
  const formatTimeForDisplay = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get position and height for a booking in the calendar grid
  const getBookingStyle = (booking) => {
    const convertTimeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return (hours - 8) * 60 + minutes; // Relative to 8:00 AM
    };

    const startMinutes = convertTimeToMinutes(booking.startTime);
    const endMinutes = convertTimeToMinutes(booking.endTime);
    const duration = endMinutes - startMinutes;

    return {
      top: `${startMinutes}px`,
      height: `${duration}px`,
    };
  };

  return (
    <div className="booking-calendar">
      <div className="calendar-header">
        <button onClick={goToPreviousDay} className="btn btn-icon">
          &lt;
        </button>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => onDateChange(e.target.value)}
          className="date-picker"
        />
        <button onClick={goToNextDay} className="btn btn-icon">
          &gt;
        </button>
      </div>

      <div className="calendar-grid">
        <div className="time-column">
          {timeSlots.map(time => (
            <div key={time} className="time-slot">
              {formatTimeForDisplay(time)}
            </div>
          ))}
        </div>

        <div className="events-column">
          {/* Time grid lines */}
          {timeSlots.map(time => (
            <div key={time} className="time-grid-line"></div>
          ))}

          {/* Render bookings */}
          {filteredBookings.map(booking => {
            // Determine if user can edit this booking
            const canEdit = currentUser.isAdmin || booking.userId === currentUser.empId;
            
            return (
              <div 
                key={booking.id}
                className={`booking-event ${canEdit ? 'can-edit' : ''}`}
                style={getBookingStyle(booking)}
                onClick={() => canEdit && onBookingClick(booking)}
                title={canEdit ? 'Click to edit' : 'Created by another user'}
              >
                <div className="booking-title">{booking.title}</div>
                <div className="booking-time">
                  {formatTimeForDisplay(booking.startTime)} - {formatTimeForDisplay(booking.endTime)}
                </div>
                <div className="booking-room">{getRoomName(booking.roomId)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedRoom ? (
        <div className="calendar-footer">
          <p>Viewing bookings for: {getRoomName(selectedRoom)}</p>
        </div>
      ) : (
        <div className="calendar-footer">
          <p>Select a room to see its bookings</p>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;