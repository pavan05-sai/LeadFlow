const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  addNote,
  getNotes,
  getLeadReports,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

// Public route for lead capture
router.post('/', createLead);

// Protected routes
router.use(protect);

router.get('/reports/monthly', getLeadReports);

router.route('/')
  .get(getLeads);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(deleteLead);

router.route('/:id/notes')
  .get(getNotes)
  .post(addNote);

module.exports = router;
