require('dotenv').config();

const { Satellite, logger } = require('@senecacdot/satellite');

const { buildStatusHandler, buildLogHandler } = require('./builds');
const credentials = require('./credentials');
const { webhookHandler } = require('./webhook');

const service = new Satellite({
  credentials: credentials(),
});
const { router } = service;

router.use('/', webhookHandler);

router.get('/status', buildStatusHandler);

// Get the current build log (as it happens)
router.get('/log/current', buildLogHandler('current'));
// Get the most recent build log
router.get('/log/previous', buildLogHandler('previous'));
// Backwards compat for API, prefer newer /log/*
router.get('/log', buildLogHandler('current'));

const port = parseInt(process.env.DEPLOY_PORT, 10) || 4000;
service.start(port, () => {
  logger.info(`Server listening on port ${port}`);
});
