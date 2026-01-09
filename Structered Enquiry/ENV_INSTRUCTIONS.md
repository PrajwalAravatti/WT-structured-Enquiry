# Environment Variables Configuration

This file contains all the environment variables required for the Electricity Bill Payment System.

## Already Configured Variables

Your `.env` file already contains all the required variables. No additional configuration is needed!

### Current Variables:

1. **MONGODB_URI**
   - **Purpose**: MongoDB connection string for database access
   - **Current Value**: ✅ Already configured
   - **Used By**: Backend database connection (`config/db.js`)
   - **Format**: `mongodb+srv://username:password@cluster.mongodb.net/?appName=ClusterName`

2. **PORT**
   - **Purpose**: Port number for the Express backend server
   - **Current Value**: `3000` ✅ Already configured
   - **Used By**: Backend server (`server.js`)
   - **Default**: 5000 (if not specified)

3. **NODE_ENV**
   - **Purpose**: Application environment (development/production)
   - **Current Value**: `development` ✅ Already configured
   - **Used By**: General application configuration

4. **FRONTEND_URL**
   - **Purpose**: Frontend application URL for CORS configuration
   - **Current Value**: `http://localhost:8000` ✅ Already configured
   - **Used By**: CORS middleware in backend
   - **Note**: Your frontend actually runs on `http://localhost:5173` (Vite default)

5. **JWT_SECRET**
   - **Purpose**: Secret key for JWT token generation (for future authentication features)
   - **Current Value**: ✅ Already configured
   - **Used By**: Authentication middleware (if implemented)
   - **Security**: Keep this value secret and never commit to version control

6. **JWT_EXPIRES_IN**
   - **Purpose**: JWT token expiration time
   - **Current Value**: `7d` (7 days) ✅ Already configured
   - **Used By**: JWT token creation (if authentication is implemented)

## ✅ Configuration Status

**All environment variables are properly configured!**

You don't need to make any changes to your `.env` file. The system is ready to run.

## 🔒 Security Best Practices

1. **Never commit `.env` to Git**
   - The `.env` file should be in your `.gitignore`
   - Contains sensitive database credentials and secrets

2. **Keep MongoDB credentials secure**
   - Don't share your `MONGODB_URI` publicly
   - Use environment-specific connection strings

3. **Rotate JWT secrets periodically**
   - Change `JWT_SECRET` in production environments regularly
   - Use strong, random values

4. **Use different values per environment**
   - Development, staging, and production should have different values
   - Never use development credentials in production

## 🚀 Running the Application

With your current `.env` configuration:

1. **Backend Server**: Will run on `http://localhost:3000`
2. **Frontend Dev Server**: Will run on `http://localhost:5173`
3. **Database**: Will connect to your MongoDB Atlas cluster

## 🔍 Troubleshooting

If you encounter connection issues:

1. **MongoDB Connection Failed**
   - Verify `MONGODB_URI` is correct
   - Check if your IP address is whitelisted in MongoDB Atlas
   - Ensure network connectivity

2. **Port Already in Use**
   - Change `PORT` value in `.env` to an available port
   - Kill any process using port 3000

3. **CORS Errors**
   - Update `FRONTEND_URL` if your frontend runs on a different port
   - The backend CORS is currently configured to allow all origins

## 📝 Future Variables (If Needed)

If you expand the application, you might need:

- `SESSION_SECRET`: For session management
- `EMAIL_HOST`, `EMAIL_PORT`: For email notifications
- `PAYMENT_GATEWAY_KEY`: For integrating payment gateways
- `REDIS_URL`: For caching

---

**Note**: Your current configuration is complete and ready for use!
