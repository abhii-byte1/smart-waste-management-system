const testE2E = async () => {
  try {
    console.log("1. Logging in...");
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@smartwaste.com', password: 'User@123' })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    
    const token = loginData.token;
    console.log("Login successful! Token:", token.slice(0, 10) + "...");

    console.log("2. Submitting complaint with base64 image...");
    const sampleBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    
    const complaintRes = await fetch('http://localhost:5000/api/complaints', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        location: "E2E Test Location",
        coordinates: { lat: 0, lng: 0 },
        description: "E2E Test Description",
        image: sampleBase64
      })
    });
    
    const complaintData = await complaintRes.json();
    if (!complaintRes.ok) throw new Error(`Complaint failed: ${JSON.stringify(complaintData)}`);

    console.log("Complaint submitted successfully!");
    console.log(complaintData);

    console.log("3. Deleting test complaint...");
    const adminLoginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@smartwaste.com', password: 'Admin@123' })
    });
    const adminData = await adminLoginRes.json();
    
    await fetch(`http://localhost:5000/api/complaints/${complaintData._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminData.token}` }
    });
    console.log("Test complaint deleted.");
    
  } catch (error) {
    console.error("E2E Test Failed!");
    console.error(error.message);
  }
};

testE2E();
