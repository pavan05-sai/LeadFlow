const Lead = require('../models/Lead');
const User = require('../models/User');
const { canAccessLead } = require('../utils/leadAccess');

const handleControllerError = (res, error, context) => {
  console.error(context, error);
  const status = error.name === 'ValidationError' || error.name === 'CastError'
    ? 400
    : error.code === 11000 ? 409 : 500;
  res.status(status).json({
    message: status === 400
      ? 'Invalid request data'
      : status === 409 ? 'A record with this information already exists' : 'Server error',
  });
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * @desc    Create new lead (public — from contact form)
 * @route   POST /api/leads
 * @access  Public
 */
const createLead = async (req, res) => {
  try {
    const { name, email, phone, source } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const lead = await Lead.create({ name, email, phone, source });
    res.status(201).json(lead);
  } catch (error) {
    handleControllerError(res, error, 'Create Lead Error:');
  }
};

/**
 * @desc    Get all leads with optional filtering, search, and sort
 * @route   GET /api/leads
 * @access  Private
 */
const getLeads = async (req, res) => {
  try {
    const { status, source, search, sortBy, order } = req.query;

    if (status && !['new', 'contacted', 'converted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid lead status' });
    }
    if (source && !['website', 'referral', 'social_media', 'advertisement', 'other'].includes(source)) {
      return res.status(400).json({ message: 'Invalid lead source' });
    }
    if (search !== undefined && (typeof search !== 'string' || search.length > 100)) {
      return res.status(400).json({ message: 'Search must be 100 characters or fewer' });
    }

    const filter = {};
    if (status) filter.status = status;
    if (source) filter.source = source;

    // Role-based filtering: Agents only see their assigned leads
    if (req.user.role === 'agent') {
      filter.assignedTo = req.user._id;
    }

    if (search?.trim()) {
      const searchPattern = escapeRegex(search.trim());
      filter.$or = [
        { name: { $regex: searchPattern, $options: 'i' } },
        { email: { $regex: searchPattern, $options: 'i' } },
      ];
    }

    const sortFields = ['createdAt', 'name', 'status'];
    if (sortBy && !sortFields.includes(sortBy)) {
      return res.status(400).json({ message: 'Invalid sort field' });
    }
    if (order && !['asc', 'desc'].includes(order)) {
      return res.status(400).json({ message: 'Invalid sort order' });
    }
    const sortField = sortBy || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const leads = await Lead.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ [sortField]: sortOrder });

    // Analytics (Filtered by role)
    const analyticsFilter = req.user.role === 'agent' ? { assignedTo: req.user._id } : {};
    
    const totalLeads = await Lead.countDocuments(analyticsFilter);
    const newLeads = await Lead.countDocuments({ ...analyticsFilter, status: 'new' });
    const contactedLeads = await Lead.countDocuments({ ...analyticsFilter, status: 'contacted' });
    const convertedLeads = await Lead.countDocuments({ ...analyticsFilter, status: 'converted' });

    res.json({
      leads,
      analytics: {
        total: totalLeads,
        new: newLeads,
        contacted: contactedLeads,
        converted: convertedLeads,
        conversionRate:
          totalLeads > 0
            ? ((convertedLeads / totalLeads) * 100).toFixed(1)
            : '0.0',
      },
    });
  } catch (error) {
    handleControllerError(res, error, 'Get Leads Error:');
  }
};

/**
 * @desc    Get single lead by ID
 * @route   GET /api/leads/:id
 * @access  Private
 */
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (!canAccessLead(lead, req.user)) {
      return res.status(403).json({ message: 'Not authorized to view this lead' });
    }

    res.json(lead);
  } catch (error) {
    handleControllerError(res, error, 'Get Lead Error:');
  }
};

/**
 * @desc    Update lead (status, info)
 * @route   PUT /api/leads/:id
 * @access  Private
 */
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (!canAccessLead(lead, req.user)) {
      return res.status(403).json({ message: 'Not authorized to update this lead' });
    }

    const { name, email, phone, source, status, assignedTo, followUpDate } = req.body;

    // Restriction: Agents cannot reassign leads
    if (req.user.role === 'agent' && (assignedTo !== undefined)) {
      return res.status(403).json({ message: 'Agents cannot reassign leads' });
    }

    if (name) lead.name = name;
    if (email) lead.email = email;
    if (phone !== undefined) lead.phone = phone;
    if (source) lead.source = source;
    if (status) lead.status = status;
    
    if (assignedTo !== undefined) {
      if (assignedTo === '' || assignedTo === null) {
        lead.assignedTo = undefined;
      } else {
        const agent = await User.findOne({ _id: assignedTo, role: 'agent' });
        if (!agent) {
          return res.status(400).json({ message: 'Assigned user must be an agent' });
        }
        lead.assignedTo = agent._id;
      }
    }
    
    if (followUpDate !== undefined) {
      lead.followUpDate = (followUpDate === '' || followUpDate === null) ? null : followUpDate;
    }

    const updatedLead = await lead.save();
    const populatedLead = await Lead.findById(updatedLead._id).populate('assignedTo', 'name email');
    res.json(populatedLead);
  } catch (error) {
    handleControllerError(res, error, 'Update Lead Error:');
  }
};

/**
 * @desc    Delete lead
 * @route   DELETE /api/leads/:id
 * @access  Private
 */
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (!canAccessLead(lead, req.user)) {
      return res.status(403).json({ message: 'Not authorized to delete this lead' });
    }

    await lead.deleteOne();
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    handleControllerError(res, error, 'Delete Lead Error:');
  }
};

/**
 * @desc    Add a note to a lead
 * @route   POST /api/leads/:id/notes
 * @access  Private
 */
const addNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (!canAccessLead(lead, req.user)) {
      return res.status(403).json({ message: 'Not authorized to add notes to this lead' });
    }

    const { text } = req.body;

    if (typeof text !== 'string' || !text.trim() || text.trim().length > 2000) {
      return res.status(400).json({ message: 'Note text must be between 1 and 2000 characters' });
    }

    lead.notes.push({ text: text.trim() });
    const updatedLead = await lead.save();
    res.status(201).json(updatedLead);
  } catch (error) {
    handleControllerError(res, error, 'Add Note Error:');
  }
};

/**
 * @desc    Get notes for a lead
 * @route   GET /api/leads/:id/notes
 * @access  Private
 */
const getNotes = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (!canAccessLead(lead, req.user)) {
      return res.status(403).json({ message: 'Not authorized to view notes for this lead' });
    }

    res.json(lead.notes);
  } catch (error) {
    handleControllerError(res, error, 'Get Notes Error:');
  }
};

/**
 * @desc    Get monthly lead reports (aggregation)
 * @route   GET /api/leads/reports/monthly
 * @access  Private
 */
const getLeadReports = async (req, res) => {
  try {
    const analyticsFilter = req.user.role === 'agent' ? { assignedTo: req.user._id } : {};
    
    // Aggregate leads by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const reports = await Lead.aggregate([
      {
        $match: {
          ...analyticsFilter,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 },
          converted: { 
            $sum: { $cond: [{ $eq: ["$status", "converted"] }, 1, 0] } 
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format reports for charts
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedReports = reports.map(r => ({
      name: `${monthNames[r._id.month - 1]} ${r._id.year}`,
      leads: r.count,
      conversions: r.converted
    }));

    res.json(formattedReports);
  } catch (error) {
    handleControllerError(res, error, 'Get Lead Reports Error:');
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  addNote,
  getNotes,
  getLeadReports,
};
