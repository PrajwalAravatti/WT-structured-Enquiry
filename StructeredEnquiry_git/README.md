# Electricity Bill Payment System

A professional full-stack web application for managing prepaid electricity bill payments with a modern, electricity-themed UI.

## 🔋 Features

- **Modern UI/UX**: Electricity-themed design with electric pulses, glowing borders, and energy flow animations
- **React Frontend**: Built with React and Vite for fast development and optimal performance
- **Express Backend**: RESTful API with comprehensive input validation and error handling
- **MongoDB Integration**: Persistent storage with Mongoose schemas and indexing
- **Real-time Validation**: Form validation and payment status determination
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## 📁 Project Structure

```
StructuredEnquiry/
├── backend/
│   ├── config/
│   │   └── db.js                    # Database connection utility
│   ├── models/
│   │   └── BillPayment.js          # Mongoose schema for bill payments
│   ├── routes/
│   │   └── billRoutes.js           # API route handlers
│   ├── server.js                   # Express server setup
│   └── package.json                # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ElectricityPlans.jsx    # Plans display component
│   │   │   └── BillSummary.jsx         # Payment summary component
│   │   ├── App.jsx                     # Main application component
│   │   ├── App.css                     # Electricity-themed styles
│   │   ├── index.css                   # Global styles
│   │   └── main.jsx                    # React entry point
│   └── package.json                # Frontend dependencies
└── .env                            # Environment variables
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 3: Environment Variables

Your `.env` file is already configured with the required variables:
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (3000)
- `JWT_SECRET` - Secret key for future authentication

No additional configuration needed!

## 🎯 Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:3000`

**Alternative (with auto-reload):**
```bash
npm run dev
```

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### POST /api/paybill

Process electricity bill payment.

**Request Body:**
```json
{
  "consumerName": "John Doe",
  "planName": "Standard Plan",
  "unitsUsed": 150
}
```

**Success Response:**
```json
{
  "paymentStatus": "success",
  "remainingUnits": 100,
  "totalAmount": 675,
  "message": "Payment processed successfully",
  "transactionId": "60d5ec49f1b2c72b8c8e4a1b",
  "transactionDate": "2026-01-03T04:25:43.000Z"
}
```

**Error Response:**
```json
{
  "paymentStatus": "failure",
  "message": "Insufficient units. Plan includes 250 units, but 300 units were used."
}
```

### GET /api/health

Health check endpoint to verify server status.

**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2026-01-03T04:25:43.000Z"
}
```

## 💡 Available Electricity Plans

| Plan Name | Price per Unit | Units Included | Validity | Status |
|-----------|---------------|----------------|----------|---------|
| Basic Plan | ₹5 | 100 kWh | 30 days | Active |
| Standard Plan | ₹4.5 | 250 kWh | 30 days | Active |
| Premium Plan | ₹4 | 500 kWh | 30 days | Active |
| Ultra Plan | ₹3.5 | 1000 kWh | 60 days | Active |

## 🗄️ Database Schema

### BillPayment Collection

The system creates a separate collection named **`billpayments`** in your MongoDB database, which you can easily view in MongoDB Compass.

**Schema Fields:**
- `consumerName` (String, required): Name of the consumer
- `planName` (String, required): Selected electricity plan
- `unitsUsed` (Number, required): Units consumed
- `amountPaid` (Number, required): Total amount paid
- `remainingUnits` (Number, required): Remaining units after consumption
- `paymentStatus` (String, enum: ['success', 'failure']): Payment status
- `transactionDate` (Date): Transaction timestamp
- `createdAt` (Date): Auto-generated creation timestamp
- `updatedAt` (Date): Auto-generated update timestamp

**Indexes:**
- `transactionDate` (descending): For faster date-based queries
- `consumerName` (ascending): For consumer lookup

## 🎨 Design Features

### Color Palette
- **Dark Background**: #0a0e27, #0f1419
- **Electric Blue/Neon**: #00d9ff, #00ffff, #3b82f6
- **Success**: #10b981
- **Error**: #ef4444

### Animations
- ⚡ Electric pulse effects on icons
- 🌟 Glowing border animations on plan cards
- 💫 Energy flow animations on buttons
- ✨ Smooth transitions and hover effects
- 🎯 Success animation with checkmark

## 🧪 Testing the Application

1. **Start both backend and frontend servers**
2. **Open browser** to `http://localhost:5173`
3. **Fill in consumer information:**
   - Enter your name
   - Enter units used (e.g., 150)
4. **Select an electricity plan** by clicking on any plan card
5. **Click "Pay Bill"** button
6. **View bill summary** with payment details
7. **Check MongoDB Compass** to see the payment record in the `billpayments` collection

## 📝 Code Explanation (For Viva/Presentation)

### Frontend React Hooks Used

1. **useState**: Managing component state
   - `selectedPlan`: Stores the selected electricity plan
   - `consumerName`: Stores consumer name input
   - `unitsUsed`: Stores units consumed input
   - `billSummary`: Stores payment response data
   - `isLoading`: Loading state during API call
   - `error`: Error message state

2. **Event Handlers**:
   - `handlePayBill()`: Processes payment by calling backend API
   - `handleNewPayment()`: Resets form for new payment

### Backend Logic

1. **Input Validation**: Checks for required fields and valid data types
2. **Plan Lookup**: Finds selected plan from predefined array
3. **Bill Calculation**: 
   - Total Amount = Units Used × Price per Unit
   - Remaining Units = Total Included Units - Units Used
4. **Payment Status**: Determines success/failure based on unit availability
5. **Database Storage**: Saves payment record to MongoDB

### Database Design

- **Schema Definition**: Using Mongoose for data modeling
- **Validation**: Built-in validators for data integrity
- **Indexing**: Optimized queries with indexes
- **Timestamps**: Automatic tracking of creation and update times

## 🛠️ Technologies Used

- **Frontend**: React 18, Vite 7
- **Backend**: Node.js, Express 4
- **Database**: MongoDB Atlas, Mongoose 8
- **Styling**: Vanilla CSS with custom animations
- **HTTP Client**: Fetch API

## 📚 Additional Notes

- All code is well-commented for easy understanding
- Clean architecture with separation of concerns
- Professional error handling throughout
- Ready for academic presentation/viva
- No emojis in the UI (only in documentation)

## 🔒 Security Considerations

- Environment variables for sensitive data
- Input validation on both frontend and backend
- MongoDB injection prevention through Mongoose
- CORS enabled for cross-origin requests

## 📞 Support

For any issues or questions, check:
1. Backend server is running on port 3000
2. Frontend server is running on port 5173
3. MongoDB connection is successful
4. All dependencies are installed

---

**Built with ⚡ by Prepaid Electricity Board**
