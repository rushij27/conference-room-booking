import React from 'react';

const MobileRoomSelector = ({ rooms, selectedRoom, onSelectRoom }) => {
  return (
    <div className="mobile-room-list">
      {/* Horizontal scrollable room cards */}
      <div className="horizontal-scroll-container">
        {rooms.map(room => (
          <div 
            key={room.id}
            className={`room-card ${selectedRoom === room.id ? 'selected' : ''}`}
            onClick={() => onSelectRoom(room.id)}
          >
            <h3>{room.name}</h3>
            <div className="room-details">
              <span className="capacity">{room.capacity} people</span>
              {room.hasProjector && <span className="feature">Projector</span>}
              {room.hasVideoConf && <span className="feature">Video Conf</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileRoomSelector;