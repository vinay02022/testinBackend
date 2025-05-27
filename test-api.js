// Simple API test script
// Run with: node test-api.js (after starting the server)

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let accessToken = '';
let refreshToken = '';
let userId = '';

async function testAPI() {
  try {
    console.log('🚀 Starting API Tests...\n');

    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Health Check:', healthResponse.data.message);

    // Test 2: User Signup
    console.log('\n2. Testing User Signup...');
    const signupData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123'
    };
    
    const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, signupData);
    console.log('✅ Signup successful:', signupResponse.data.message);
    
    accessToken = signupResponse.data.data.accessToken;
    refreshToken = signupResponse.data.data.refreshToken;
    userId = signupResponse.data.data.user.id;

    // Test 3: Get Profile
    console.log('\n3. Testing Get Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.data.user.email);

    // Test 4: Update Permissions
    console.log('\n4. Testing Update Permissions...');
    const permissionData = { permissions: ['read', 'write', 'delete'] };
    const permissionResponse = await axios.put(
      `${BASE_URL}/users/${userId}/permissions`,
      permissionData,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    console.log('✅ Permissions updated:', permissionResponse.data.data.user.permissions);

    // Test 5: Create Comment
    console.log('\n5. Testing Create Comment...');
    const commentData = { content: 'This is a test comment!' };
    const commentResponse = await axios.post(`${BASE_URL}/comments`, commentData, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Comment created:', commentResponse.data.data.comment.content);

    // Test 6: Get Comments
    console.log('\n6. Testing Get Comments...');
    const commentsResponse = await axios.get(`${BASE_URL}/comments`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Comments retrieved:', commentsResponse.data.data.count, 'comments');

    // Test 7: Refresh Token
    console.log('\n7. Testing Refresh Token...');
    const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: refreshToken
    });
    console.log('✅ Token refreshed successfully');

    // Test 8: Login
    console.log('\n8. Testing Login...');
    const loginData = { email: 'test@example.com', password: 'Password123' };
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ Login successful:', loginResponse.data.data.user.email);

    console.log('\n🎉 All tests passed! API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests
testAPI(); 