import React, { useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../hooks/useAuth';
import RoomList from './RoomList';
import BookingCalendar from './BookingCalendar';
import BookingForm from './BookingForm';
import RoomForm from './RoomForm';
import UserManagement from './UserManagement';

const Dashboard = () => {
  const { rooms, selectedDate, setSelectedDate } = useBookings();
  const { currentUser } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'users'

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="dashboard">
      {currentUser?.isAdmin && (
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => handleTabChange('bookings')}
          >
            Room Bookings
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            User Management
          </button>
        </div>
      )}

      {activeTab === 'bookings' ? (
        <div className="dashboard-content">
          <aside className="sidebar">
            <div className="sidebar-header">
              <h2>Conference Rooms</h2>
              {currentUser?.isAdmin && (
                <button 
                  className="btn btn-primary"
                  onClick={handleAddRoom}
                >
                  Add Room
                </button>
              )}
            </div>
            <RoomList 
              rooms={rooms} 
              selectedRoom={selectedRoom} 
              onSelectRoom={handleRoomSelect}
            />
          </aside>
          
          <main className="main-content">
            <div className="actions">
              <h2>Bookings for {selectedDate}</h2>
              <button 
                className="btn btn-primary"
                onClick={handleAddBooking}
                disabled={!selectedRoom}
              >
                Book Room
              </button>
            </div>
            
            <BookingCalendar 
              date={selectedDate}
              onDateChange={handleDateChange}
              selectedRoom={selectedRoom}
              onBookingClick={handleBookingClick}
            />
          </main>
        </div>
      ) : (
        <UserManagement />
      )}

      {isBookingFormOpen && (
        <div className="modal">
          <div className="modal-content">
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
          <div className="modal-content">
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