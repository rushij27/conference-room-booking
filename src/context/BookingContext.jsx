import React, { createContext, useState, useEffect } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // Initial sample data
  const initialRooms = [
    { id: 1, name: 'Boardroom A', capacity: 12, amenities: ['Projector', 'Whiteboard', 'Video Conference'] },
    { id: 2, name: 'Meeting Room B', capacity: 6, amenities: ['TV Screen', 'Whiteboard'] },
    { id: 3, name: 'Conference Hall', capacity: 30, amenities: ['Projector', 'Sound System', 'Video Conference'] },
  ];

  // Today's date
  const today = new Date();
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Generate some sample bookings for today and tomorrow
  const generateSampleBookings = () => {
    return [
      { 
        id: 1, 
        roomId: 1, 
        title: 'Weekly Team Meeting', 
        date: formatDate(today), 
        startTime: '09:00', 
        endTime: '10:00', 
        userId: 'ADMIN001',
        attendees: 8
      },
      { 
        id: 2, 
        roomId: 3, 
        title: 'Project Kickoff', 
        date: formatDate(today), 
        startTime: '14:00', 
        endTime: '15:30', 
        userId: 'ADMIN002',
        attendees: 15
      },
      { 
        id: 3, 
        roomId: 2, 
        title: 'Client Call', 
        date: formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000)), // tomorrow
        startTime: '11:00', 
        endTime: '12:00', 
        userId: 'EMP001',
        attendees: 4
      },
    ];
  };

  // Attempt to load data from localStorage
  const loadRooms = () => {
    const savedRooms = localStorage.getItem('conferenceRooms');
    return savedRooms ? JSON.parse(savedRooms) : initialRooms;
  };

  const loadBookings = () => {
    const savedBookings = localStorage.getItem('conferenceBookings');
    return savedBookings ? JSON.parse(savedBookings) : generateSampleBookings();
  };

  // State
  const [rooms, setRooms] = useState(loadRooms);
  const [bookings, setBookings] = useState(loadBookings);
  const [selectedDate, setSelectedDate] = useState(formatDate(today));

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('conferenceRooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('conferenceBookings', JSON.stringify(bookings));
  }, [bookings]);

  // Add a new room
  const addRoom = (room) => {
    const newRoom = {
      id: rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1,
      ...room
    };
    setRooms([...rooms, newRoom]);
    return newRoom;
  };

  // Update an existing room
  const updateRoom = (updatedRoom) => {
    setRooms(rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room));
  };

  // Delete a room
  const deleteRoom = (roomId) => {
    // Check if there are any bookings for this room
    const hasBookings = bookings.some(booking => booking.roomId === roomId);
    if (hasBookings) {
      return { success: false, message: 'Cannot delete a room with existing bookings' };
    }
    
    setRooms(rooms.filter(room => room.id !== roomId));
    return { success: true };
  };
  
  // Add a new booking
  const addBooking = (booking, userId) => {
    // Validate if the room is available for the requested time slot
    if (!isRoomAvailable(booking.roomId, booking.date, booking.startTime, booking.endTime, null)) {
      return { success: false, message: 'This time slot is already booked' };
    }

    const room = rooms.find(r => r.id === booking.roomId);
    
    // Validate room capacity
    if (booking.attendees > room.capacity) {
      return { 
        success: false, 
        message: `The number of attendees exceeds room capacity (${room.capacity} people)` 
      };
    }

    const newBooking = {
      id: bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1,
      userId: userId,
      ...booking
    };
    
    setBookings([...bookings, newBooking]);
    return { success: true, booking: newBooking };
  };

  // Update an existing booking
  const updateBooking = (updatedBooking, currentUser, isAdmin) => {
    // Validate if the room is available for the requested time slot
    if (!isRoomAvailable(
      updatedBooking.roomId, 
      updatedBooking.date, 
      updatedBooking.startTime, 
      updatedBooking.endTime, 
      updatedBooking.id
    )) {
      return { success: false, message: 'This time slot is already booked' };
    }

    const room = rooms.find(r => r.id === updatedBooking.roomId);
    
    // Validate room capacity
    if (updatedBooking.attendees > room.capacity) {
      return { 
        success: false, 
        message: `The number of attendees exceeds room capacity (${room.capacity} people)` 
      };
    }

    // Find the original booking
    const originalBooking = bookings.find(b => b.id === updatedBooking.id);
    
    // Check if user has permission to update the booking
    if (!isAdmin && originalBooking.userId !== currentUser) {
      return { success: false, message: 'You can only update your own bookings' };
    }

    setBookings(bookings.map(booking => 
      booking.id === updatedBooking.id ? updatedBooking : booking
    ));
    
    return { success: true };
  };

  // Delete a booking
  const deleteBooking = (bookingId, currentUser, isAdmin) => {
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
      return { success: false, message: 'Booking not found' };
    }
    
    // Only the creator of the booking or an admin can delete it
    if (!isAdmin && booking.userId !== currentUser) {
      return { success: false, message: 'You can only delete your own bookings' };
    }
    
    setBookings(bookings.filter(booking => booking.id !== bookingId));
    return { success: true };
  };

  // Check if a room is available for a given time slot
  const isRoomAvailable = (roomId, date, startTime, endTime, excludeBookingId = null) => {
    // Convert times to comparable format (minutes since midnight)
    const convertTimeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const requestStart = convertTimeToMinutes(startTime);
    const requestEnd = convertTimeToMinutes(endTime);

    // Check against existing bookings
    return !bookings.some(booking => {
      // Skip the booking we're updating
      if (excludeBookingId && booking.id === excludeBookingId) {
        return false;
      }

      // Check if it's the same room and date
      if (booking.roomId === roomId && booking.date === date) {
        const bookingStart = convertTimeToMinutes(booking.startTime);
        const bookingEnd = convertTimeToMinutes(booking.endTime);

        // Check for overlap
        // (Start1 < End2) && (End1 > Start2)
        return (requestStart < bookingEnd) && (requestEnd > bookingStart);
      }
      
      return false;
    });
  };

  // Get all bookings for a specific date
  const getBookingsByDate = (date) => {
    return bookings.filter(booking => booking.date === date);
  };

  // Get all bookings for a specific room
  const getBookingsByRoom = (roomId) => {
    return bookings.filter(booking => booking.roomId === roomId);
  };

  // Get room details by id
  const getRoomById = (roomId) => {
    return rooms.find(room => room.id === roomId);
  };

  // Get all available time slots for a specific room and date
  const getAvailableTimeSlots = (roomId, date) => {
    // Business hours from 8:00 to 18:00
    const businessHours = [];
    for (let hour = 8; hour < 18; hour++) {
      businessHours.push(`${hour.toString().padStart(2, '0')}:00`);
      businessHours.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    const roomBookings = bookings.filter(
      booking => booking.roomId === roomId && booking.date === date
    );

    // Check each business hour if it's available
    return businessHours.filter(time => {
      // Consider a slot available if no booking starts at this time
      // This is simplified - a more complete implementation would check for overlaps
      return !roomBookings.some(booking => booking.startTime === time);
    });
  };

  // The context value
  const contextValue = {
    rooms,
    bookings,
    selectedDate,
    setSelectedDate,
    addRoom,
    updateRoom,
    deleteRoom,
    addBooking,
    updateBooking,
    deleteBooking,
    isRoomAvailable,
    getBookingsByDate,
    getBookingsByRoom,
    getRoomById,
    getAvailableTimeSlots,
    formatDate
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};