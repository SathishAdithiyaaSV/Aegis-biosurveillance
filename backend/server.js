
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const dataRoutes = require('./routes/dataRoutes');
const escalationRoutes = require("./routes/escalationRoutes");
const readinessRoutes = require('./routes/readinessRoutes');
const surveillanceRoutes = require('./routes/surveillanceRoutes');

// Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', dataRoutes);
app.use("/api/escalation", escalationRoutes);
app.use('/api/readiness', readinessRoutes);
app.use('/api/surveillance', surveillanceRoutes);

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log('Connected to DB & listening on port', port);
    });
  })
  .catch((error) => {
    console.log(error);
  });
