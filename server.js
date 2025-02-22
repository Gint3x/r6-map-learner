const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load routes
const mapRoutes = require('./routes/maps');
const resultRoutes = require('./routes/results');

app.use('/api/maps', mapRoutes);
app.use('/api/results', resultRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
