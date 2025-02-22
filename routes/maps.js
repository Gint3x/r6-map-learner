const express = require('express');
const router = express.Router();
const maps = require('../data/maps.json');
const clickableAreas = require('../data/clickable-areas.json');

// Get available maps
router.get('/', (req, res) => {
  res.json(maps.map(m => m.name)); // Return only map names
});

// Get floors for a specific map
router.get('/:mapName/floors', (req, res) => {
  const mapName = req.params.mapName;
  if (!clickableAreas[mapName]) {
    return res.status(404).json({ message: 'Map not found' });
  }

  res.json(Object.keys(clickableAreas[mapName])); // Returns available floors
});

// Get clickable areas for a specific floor
router.get('/:mapName/:floorName', (req, res) => {
  const { mapName, floorName } = req.params;
  const floorData = clickableAreas[mapName]?.[floorName];

  if (!floorData) {
    return res.status(404).json({ message: 'Floor not found' });
  }

  res.json({
    floorImage: `/images/${mapName}/${floorName}.jpg`,
    hotspots: floorData
  });
});

module.exports = router;
