const router = require('express').Router();

// Import all of the API routes from /api/index.js (no need for index.js though since it's implied)
const htmlRoutes = require('./html/html-routes');
const apiRoutes = require('./api');

router.use('/', htmlRoutes);
router.use('/api', apiRoutes);

router.use((req, res) => {
  res.status(404).send('<h1>😝 404 Error!</h1>');
});

module.exports = router;
