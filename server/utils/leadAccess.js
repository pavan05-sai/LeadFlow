const canAccessLead = (lead, user) => {
  if (user.role !== 'agent') {
    return true;
  }

  const assignedUser = lead.assignedTo?._id || lead.assignedTo;
  return assignedUser?.toString() === user._id.toString();
};

module.exports = { canAccessLead };
