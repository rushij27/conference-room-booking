import React, { useState, useEffect } from 'react';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../hooks/useAuth';
import RoomList from './RoomList';
import BookingCalendar from './BookingCalendar';
import BookingForm from './BookingForm';
import RoomForm from './RoomForm';
import MobileRoomSelector from './MobileRoomSelector'; // New component for mobile view

const Dashboard = () => {
  const { rooms, selectedDate, setSelectedDate } = useBookings();
  const { currentUser } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState(1);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isRoomListExpanded, setIsRoomListExpanded] = useState(false);

  // Check if the device is mobile based on screen width
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
    // Auto-collapse room list on mobile after selection
    if (isMobile) {
      setIsRoomListExpanded(false);
    }
  };

  const handleBookingClick = (booking) => {
    setEditingBooking(booking);
    setIsBookingFormOpen(true);
  };

  const handleAddBooking = () => {
    setEditingBooking(null);
    setIsBookingFormOpen(true);
  };

  const handleAddRoom = () => {
    setIsRoomFormOpen(true);
  };

  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false);
    setEditingBooking(null);
  };

  const handleCloseRoomForm = () => {
    setIsRoomFormOpen(false);
  };

  const toggleRoomList = () => {
    setIsRoomListExpanded(!isRoomListExpanded);
  };

  // Format date for display
  const formatDateForDisplay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get the name of the selected room
  const getSelectedRoomName = () => {
    const room = rooms.find(r => r.id === selectedRoom);
    return room ? room.name : 'Select a room';
  };

  return (
    <div className="dashboard">
      <div className={`dashboard-content ${isMobile ? 'mobile-view' : ''}`}>
        {/* For desktop view - traditional sidebar */}
        {!isMobile && (
          <aside className="sidebar">
            <div className="sidebar-header">
              <h2>Conference Rooms</h2>
              {currentUser?.isAdmin && (
                <button
                  className="btn btn-primary"
                  onClick={handleAddRoom}
                >
                  Add
                </button>
              )}
            </div>
            <RoomList
              rooms={rooms}
              selectedRoom={selectedRoom}
              onSelectRoom={handleRoomSelect}
            />
          </aside>
        )}

        {/* For mobile view - collapsible room selector */}
        {isMobile && (
          <div className="mobile-room-selector-container">
            <div style={{ marginBottom: '10px' }}>
              <h3>Conference Room</h3>
            </div>
            <div className="mobile-header">
              <h2 onClick={toggleRoomList} className="room-selector-toggle">
                {getSelectedRoomName()} <span className={`arrow ${isRoomListExpanded ? 'up' : 'down'}`}>▼</span>
              </h2>
              {currentUser?.isAdmin && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleAddRoom}
                >
                  Add
                </button>
              )}
            </div>
            
            {isRoomListExpanded && (
              <MobileRoomSelector
                rooms={rooms}
                selectedRoom={selectedRoom}
                onSelectRoom={handleRoomSelect}
              />
            )}
          </div>
        )}

        <main className={`main-content ${isMobile ? 'mobile-main' : ''}`}>
          <div className="actions">
            <h2 className={isMobile ? 'mobile-heading' : ''}>
              Book for
              <span style={{
                backgroundColor: "var(--secondary-color)",
                padding: isMobile ? "4px 8px" : "5px 10px",
                borderBottom: "2px solid var(--primary-color)",
                borderRadius: "var(--border-radius)"
              }}>
                {formatDateForDisplay(selectedDate)}
              </span>
            </h2>
            <button
              className={`btn btn-primary ${isMobile ? 'btn-sm' : ''}`}
              onClick={handleAddBooking}
              disabled={!selectedRoom}
            >
              Book
            </button>
          </div>
          
          <BookingCalendar
            date={selectedDate}
            onDateChange={handleDateChange}
            selectedRoom={selectedRoom}
            onBookingClick={handleBookingClick}
            isMobile={isMobile}
          />
        </main>
      </div>

      {isBookingFormOpen && (
        <div className="modal">
          <div className={`modal-content ${isMobile ? 'mobile-modal' : ''}`}>
            <BookingForm
              booking={editingBooking}
              roomId={selectedRoom}
              date={selectedDate}
              onClose={handleCloseBookingForm}
            />
          </div>
        </div>
      )}

      {isRoomFormOpen && (
        <div className="modal">
          <div className={`modal-content ${isMobile ? 'mobile-modal' : ''}`}>
            <RoomForm
              onClose={handleCloseRoomForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;