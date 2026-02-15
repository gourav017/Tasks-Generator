// Simple health check test
const http = require('http');

const testHealthEndpoint = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 5000,
      path: '/api/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('Health Check Response:', JSON.stringify(response, null, 2));
          
          if (response.services && response.services.backend) {
            console.log('✓ Backend is healthy');
          }
          
          if (response.services && response.services.database) {
            console.log(`✓ Database status: ${response.services.database.status}`);
          }
          
          if (response.services && response.services.ai) {
            console.log(`✓ AI service status: ${response.services.ai.status}`);
          }
          
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('✗ Health check failed:', error.message);
      reject(error);
    });

    req.end();
  });
};

// Run test
console.log('Running health check test...\n');
testHealthEndpoint()
  .then(() => {
    console.log('\n✓ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Test failed:', error.message);
    process.exit(1);
  });