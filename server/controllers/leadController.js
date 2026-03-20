const Lead = require('../models/Lead');

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
    res.status(500).json({ message: 'Server error', error: error.message });
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

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    
    // Role-based filtering: Agents only see their assigned leads
    if (req.user.role === 'agent') {
      filter.assignedTo = req.user._id;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
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
    res.status(500).json({ message: 'Server error', error: error.message });
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

    // Access control: Agents can only view their own leads
    if (req.user.role === 'agent' && lead.assignedTo?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this lead' });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
        lead.assignedTo = assignedTo;
      }
    }
    
    if (followUpDate !== undefined) {
      lead.followUpDate = (followUpDate === '' || followUpDate === null) ? null : followUpDate;
    }

    const updatedLead = await lead.save();
    const populatedLead = await Lead.findById(updatedLead._id).populate('assignedTo', 'name email');
    res.json(populatedLead);
  } catch (error) {
    console.error('Update Lead Error:', error); // CRITICAL LOG
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack 
    });
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

    await lead.deleteOne();
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Note text is required' });
    }

    lead.notes.push({ text });
    const updatedLead = await lead.save();
    res.status(201).json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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

    res.json(lead.notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
    res.status(500).json({ message: 'Server error', error: error.message });
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
