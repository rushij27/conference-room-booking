import React from 'react';
import { useBookings } from '../hooks/useBookings';

const RoomList = ({ rooms, selectedRoom, onSelectRoom }) => {
  const { getBookingsByRoom } = useBookings();

  return (
    <div className="room-list">
      {rooms.map(room => {
        const roomBookings = getBookingsByRoom(room.id);
        
        return (
          <div 
            key={room.id} 
            className={`room-card ${selectedRoom === room.id ? 'selected' : ''}`}
            onClick={() => onSelectRoom(room.id)}
          >
            <h3>{room.name}</h3>
            <div className="room-details">
              <p>Capacity: {room.capacity}</p>
              <p>Amenities: {room.amenities.join(', ')}</p>
              <p>Total bookings: {roomBookings.length}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomList;
