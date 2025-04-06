import { useContext } from 'react';
import { BookingContext } from '../context/BookingContext';

export const useBookings = () => {
  return useContext(BookingContext);
};