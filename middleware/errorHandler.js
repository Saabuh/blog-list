//middleware/errorHandler.js

const errorHandler = (error, request, response, next) => {
  console.error("ERROR STACK:", error.stack); // Log the full error stack for debugging
  console.error("ERROR MESSAGE:", error.message);

  // Check for specific custom error properties or types
  if (error.name === "ValidationError") {
    // Example: Mongoose validation error
    return response.status(400).json({ error: error.message });
  }

  if (error.name === "JsonWebTokenError") {
    // Example: JWT authentication error
    return response.status(401).json({ error: "Invalid token" });
  }

  if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "Token expired" });
  }

  // Your custom error for invalid login (or other 400 errors)
  // You might set a 'status' property on your custom errors
  if (error.status) {
    return response.status(error.status).json({ error: error.message });
  }

  // Default to 500 Internal Server Error if no specific handling
  response.status(500).json({ error: "Something went wrong on the server" });

  // You don't usually call next(error) again from an error handler,
  // unless you have multiple error handlers chained for different purposes.
};

module.exports = errorHandler;
