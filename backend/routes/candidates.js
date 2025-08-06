const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { generalLimiter } = require('../middleware/rateLimiter');
const auth = require('../middleware/auth');

// Apply rate limiting to all routes
router.use(generalLimiter);

// Public routes
router.get('/', candidateController.getCandidates);
router.get('/stats', candidateController.getCandidateStats);
router.get('/:id', candidateController.getCandidateById);

// Protected routes (require authentication)
router.post('/', auth, candidateController.createCandidate);
router.put('/:id/status', auth, candidateController.updateCandidateStatus);
router.delete('/:id', auth, candidateController.deleteCandidate);

module.exports = router;
