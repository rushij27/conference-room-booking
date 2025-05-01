import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Search, ArrowLeft, Coffee, AlertCircle } from 'lucide-react';
import '../styles/NotFound.css'; // Import the CSS file

const NotFound = () => {
  const [doorOpen, setDoorOpen] = useState(false);
  const [shake, setShake] = useState(false);

  // Handle door interaction
  const toggleDoor = () => {
    setDoorOpen(!doorOpen);
    if (!doorOpen) {
      setTimeout(() => setDoorOpen(false), 1500);
    }
  };

  // Handle room shake effect
  const shakeRoom = () => {
    setShake(true);
    setTimeout(() => setShake(false), 820);
  };

  return (
    <div className="notfound-container">
      {/* Time and date info */}
      <div className="notfound-quote">
        <p>"Even the best meeting planners sometimes end up in the wrong room."</p>
      </div>

      {/* Interactive Room Container */}
      <div 
        className="notfound-room-container"
        onClick={shakeRoom}
      >
        <div className={`notfound-room ${shake ? 'shake' : ''}`}>
          {/* Room background */}
          <div className={`notfound-room-bg`}>
            {/* Room number */}
            <div className="notfound-room-number">404</div>
            
            {/* Conference table */}
            <div className="notfound-table">
              {/* Coffee cup */}
              <div className="notfound-coffee">
                <Coffee />
              </div>
            </div>
          </div>
          
          {/* Door with interaction */}
          <div 
            className={`notfound-door ${doorOpen ? 'open' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleDoor();
            }}
            title="Click to open door"
          >
            <div className="notfound-doorknob"></div>
            
            {doorOpen && (
              <div className="notfound-door-message">
                No meetings here!
              </div>
            )}
          </div>
          
          {/* Alert notification */}
          <div className="notfound-alert">
            <div className="notfound-alert-icon">
              <AlertCircle />
              <span className="notfound-alert-text"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="notfound-content">
        <h1 className="notfound-title">Oops! Landed on the wrong page</h1>
        
        <p className="notfound-description">
          The page you are expecting isn't on our floor plan
        </p>
      </div>
      
      {/* Navigation buttons */}
      <div className="notfound-buttons">
        <Link 
          to="/"
          className="notfound-button notfound-button-primary"
        >
          <ArrowLeft />
          Back to Dashboard
        </Link>
        
        {/* <Link
          to="/rooms"
          className="notfound-button notfound-button-secondary"
        >
          <Search />
          Find Available Rooms
        </Link> */}
      </div>
    </div>
  );
};

export default NotFound;