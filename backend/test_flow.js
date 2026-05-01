const axios = require('axios');

async function testFlow() {
  const email = `test_${Date.now()}@example.com`;
  const password = 'password123';

  try {
    // Register
    console.log('Registering...');
    const regRes = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: email,
      phone: '1234567890',
      password: password,
      role: 'supplier',
      business_name: 'Test Business'
    });
    console.log('Register Success:', regRes.data);

    // Login
    console.log('Logging in...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: email,
      password: password
    });
    console.log('Login Success:', loginRes.data);
  } catch (err) {
    console.error('Flow Failed:', err.response?.data || err.message);
  }
}

testFlow();
