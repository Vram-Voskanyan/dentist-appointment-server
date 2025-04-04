# Dentist Appointment Booking API

A minimal backend structure for a dentist appointment booking application. This API provides endpoints for date picker, dentist selection, and booking functionality.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/dentist-appointment-db
   ```
4. Start the server:
   ```
   npm start
   ```
   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### GET /dentists

Fetch a list of all available dentists.

**Response:**
```json
[
  {
    "id": "dentist_123",
    "name": "Dr. Sarah White",
    "specialty": "Orthodontics"
  },
  {
    "id": "dentist_456",
    "name": "Dr. John Lee",
    "specialty": "General Dentistry"
  }
]
```

### GET /availability

Get available time slots for a specific date (and optionally a dentist).

**Query Parameters:**
- `date` (required): Format YYYY-MM-DD
- `dentistId` (optional): Filter availability by a specific dentist

**Response:**
```json
{
  "date": "2025-04-15",
  "dentistId": "dentist_123",
  "availableSlots": [
    "09:00",
    "10:30",
    "13:00",
    "15:30"
  ]
}
```

### POST /appointments

Book an appointment with a dentist on a selected date and time.

**Request Body:**
```json
{
  "dentistId": "dentist_123",
  "date": "2025-04-15",
  "time": "10:30",
  "patient": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+123456789"
  }
}
```

**Response:**
```json
{
  "appointmentId": "appt_789",
  "status": "confirmed"
}
```

## Database Models

### Dentist

| Field     | Type   |
|-----------|--------|
| id        | string |
| name      | string |
| specialty | string |

### Appointment

| Field         | Type   |
|---------------|--------|
| id            | string |
| dentist_id    | string |
| date          | date   |
| time          | string |
| patient_name  | string |
| patient_email | string |
| patient_phone | string |
| status        | string |