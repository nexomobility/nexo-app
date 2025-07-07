const fs = require('fs');

const source = fs.readFileSync('./src/App.js', 'utf8');
if (/Willkommen zur Nexo-App/.test(source)) {
  console.log('Test passed: welcome message found.');
  process.exit(0);
} else {
  console.error('Test failed: welcome message not found.');
  process.exit(1);
}
