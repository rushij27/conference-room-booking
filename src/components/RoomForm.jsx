import React, { useState } from 'react';
import { useBookings } from '../hooks/useBookings';

const RoomForm = ({ onClose }) => {
  const { addRoom } = useBookings();
  const [formData, setFormData] = useState({
    name: '',
    capacity: 10,
    amenities: []
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Available amenities options
  const amenitiesOptions = [
    'Projector',
    'Whiteboard',
    'TV Screen',
    'Video Conference',
    'Sound System',
    'Coffee Machine',
    'Water Dispenser'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle amenities checkboxes
      if (checked) {
        setFormData(prev => ({
          ...prev,
          amenities: [...prev.amenities, value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          amenities: prev.amenities.filter(amenity => amenity !== value)
        }));
      }
    } else {
      // Handle other inputs
      setFormData(prev => ({
        ...prev,
        [name]: name === 'capacity' ? parseInt(value, 10) : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate input
    if (!formData.name) {
      setError('Please enter a room name');
      return;
    }

    if (formData.capacity < 1) {
      setError('Capacity must be at least 1');
      return;
    }

    // Add the room
    const newRoom = addRoom(formData);
    setSuccess(`Room "${newRoom.name}" added successfully!`);
    
    // Reset form
    setFormData({
      name: '',
      capacity: 10,
      amenities: []
    });

    // Close modal after delay
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="room-form">
      <div className="form-header">
        <h2>Add Conference Room</h2>
        <button onClick={onClose} className="btn-close">×</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Room Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter room name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Amenities</label>
          <div className="checkbox-group">
            {amenitiesOptions.map(amenity => (
              <div key={amenity} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`amenity-${amenity}`}
                  name="amenities"
                  value={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={handleChange}
                />
                <label htmlFor={`amenity-${amenity}`}>{amenity}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Add Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;