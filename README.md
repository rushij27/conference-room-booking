# Conference Room Booking System

A modern, responsive React application for managing office conference room bookings with admin and user roles.

![Conference Room Booking System](/src/assets/658af8e0-fb7a-4442-a641-1a123cb7bfdb_1.jpeg)

## Features

- **User Authentication**: Simple login system using employee IDs
- **Role-Based Access Control**: Admin and regular user permissions
- **Room Management**: Add, edit, and view conference rooms
- **Booking System**: Schedule rooms with validation to prevent double-booking
- **User Management**: Admins can manage users and their permissions
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Persistent Data**: Local storage to maintain state between sessions

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/conference-room-booking.git
cd conference-room-booking
```

2. Install dependencies:
```
yarn
```

3. Start the development server:
```
yarn dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
conference-room-booking/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── login.css
│   ├── components/
│   │   ├── BookingCalendar.jsx
│   │   ├── BookingForm.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Header.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── RoomForm.jsx
│   │   ├── RoomList.jsx
│   │   ├── UserForm.jsx
│   │   └── UserManagement.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── BookingContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useBookings.js
│   ├── App.jsx
│   ├── index.jsx
│   └── styles.css
├── package.json
└── README.md
```

## User Roles

### Admin Users
- Create and manage rooms
- Manage user accounts (create, edit, delete)
- Create other admin accounts
- Book any room
- View, edit, and delete any booking

### Regular Users
- View available rooms
- Create bookings for themselves
- View, edit, and delete only their own bookings

## Authentication

The application uses a simple employee ID-based authentication system. For demo purposes, the following accounts are available:

- **Admin Access**: 
  - Employee ID: `ADMIN001` (John Doe)
  - Employee ID: `ADMIN002` (Jane Smith)

- **Regular User Access**:
  - Employee ID: `EMP001` (Mike Johnson)
  - Employee ID: `EMP002` (Sarah Williams)

## Routes

- `/login` - Login page
- `/dashboard` - Main booking interface
- `/users` - User management (admin only)
- `/*` - 404 page for non-existent routes

## Data Persistence

The application uses browser localStorage to persist:
- User authentication state
- User accounts
- Room information
- Booking data

This allows the application to maintain state between page refreshes and browser sessions.

## Responsive Design

The application is fully responsive and works on:
- Mobile phones (portrait and landscape)
- Tablets
- Desktops and laptops

The login page features a split-screen design with an image for larger screens and a stacked layout for mobile devices.

## Technologies Used

- **React**: UI library
- **React Router**: Page routing and navigation
- **Context API**: State management
- **LocalStorage API**: Data persistence
- **CSS3**: Styling with custom properties and media queries

## Development Notes

### Adding New Features

1. **New Room Types**:
   - Modify the `RoomForm.jsx` component to include additional fields
   - Update the room rendering in `RoomList.jsx`

2. **Additional User Roles**:
   - Extend the user management form in `UserForm.jsx`
   - Add role-based logic in the protected routes

3. **Calendar Integration**:
   - The `BookingCalendar.jsx` component can be extended to support external calendar APIs

### Best Practices

- Use the provided context hooks for accessing state:
  - `useAuth()` for authentication and user management
  - `useBookings()` for room and booking operations

- Leverage the protected route components for new pages:
  - `<ProtectedRoute>` for authenticated users
  - `<AdminRoute>` for admin-only features

## License

[MIT License](LICENSE)

## Contact

For questions or support, please contact your system administrator.