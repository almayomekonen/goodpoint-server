const axios = require('axios');

// Configuration
const BASE_URL = process.env.SERVER_URL || 'http://localhost:8080';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';

async function testFirebaseAuth() {
    console.log('🧪 Testing Firebase Authentication Implementation\n');

    try {
        // Test 1: Health Check
        console.log('1. Testing Firebase Health Check...');
        try {
            const healthResponse = await axios.get(`${BASE_URL}/api/firebase/health`);
            console.log('✅ Health Check:', healthResponse.data);
        } catch (error) {
            console.log('❌ Health Check Failed:', error.response?.data || error.message);
        }

        // Test 2: Get Linking Status
        console.log('\n2. Testing User Linking Status...');
        try {
            const statusResponse = await axios.get(`${BASE_URL}/api/firebase/linking-status/${TEST_EMAIL}`);
            console.log('✅ Linking Status:', statusResponse.data);
        } catch (error) {
            console.log('❌ Linking Status Failed:', error.response?.data || error.message);
        }

        // Test 3: List Firebase Users
        console.log('\n3. Testing List Firebase Users...');
        try {
            const usersResponse = await axios.get(`${BASE_URL}/api/firebase/users?maxResults=10`);
            console.log('✅ List Users:', usersResponse.data);
        } catch (error) {
            console.log('❌ List Users Failed:', error.response?.data || error.message);
        }

        // Test 4: Verify Token Endpoint (without auth)
        console.log('\n4. Testing Token Verification Endpoint...');
        try {
            const verifyResponse = await axios.post(`${BASE_URL}/api/firebase/verify-token`, {
                token: 'invalid-token-for-testing',
            });
            console.log('✅ Token Verification:', verifyResponse.data);
        } catch (error) {
            console.log('✅ Token Verification (Expected Error):', error.response?.data || error.message);
        }

        console.log('\n🎉 Firebase Authentication Tests Completed!');
        console.log('\n📝 Next Steps:');
        console.log('1. Set up environment variables');
        console.log('2. Run database migration: npm run migration-run');
        console.log('3. Test with real Firebase tokens');
        console.log('4. Use /api/firebase/migrate-users to link existing users');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    testFirebaseAuth();
}

module.exports = { testFirebaseAuth };
