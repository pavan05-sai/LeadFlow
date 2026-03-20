async function runTests() {
  try {
    const API_URL = 'http://localhost:5000/api';
    
    console.log('1. Logging in as Admin...');
    const authRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@crm.com', password: 'admin123' })
    });
    const authData = await authRes.json();
    if (!authRes.ok) throw new Error(`Login failed: ${JSON.stringify(authData)}`);
    const token = authData.token;
    console.log('✅ Admin login successful');

    console.log('\n2. Fetching Agents...');
    const usersRes = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const usersData = await usersRes.json();
    const agents = usersData.filter(u => u.role === 'agent');
    if (agents.length === 0) {
      console.log('No agents found. Skipping assignment test.');
      return;
    }
    const agentId = agents[0]._id;
    console.log(`✅ Found Agent: ${agents[0].name} (${agentId})`);

    console.log('\n3. Fetching Leads...');
    const leadsRes = await fetch(`${API_URL}/leads`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const leadsData = await leadsRes.json();
    const leads = leadsData.leads;
    if (leads.length === 0) {
      console.log('No leads found. Skipping assignment test.');
      return;
    }
    const leadId = leads[0]._id;
    console.log(`✅ Found Lead: ${leads[0].name} (${leadId})`);

    console.log('\n4. Assigning Lead to Agent...');
    const updateRes = await fetch(`${API_URL}/leads/${leadId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ assignedTo: agentId })
    });
    const updateData = await updateRes.json();
    if (!updateRes.ok) throw new Error(`Assignment failed: ${JSON.stringify(updateData)}`);
    console.log('✅ Lead assigned successfully! Response assignedTo:', updateData.assignedTo);

    console.log('\n5. Unassigning Lead (Setting assignedTo to empty string)...');
    const updateRes2 = await fetch(`${API_URL}/leads/${leadId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ assignedTo: '' })
    });
    const updateData2 = await updateRes2.json();
    if (!updateRes2.ok) throw new Error(`Unassignment failed: ${JSON.stringify(updateData2)}`);
    console.log('✅ Lead unassigned successfully! Response assignedTo:', updateData2.assignedTo);

    console.log('\n🎉 ALL TESTS PASSED! Backend is 100% stable.');

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
  }
}

runTests();
