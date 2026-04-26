const fs = require('fs');
let code = fs.readFileSync('D:/deploy_web/Khainguyenpharma/backend/src/config/resend.js', 'utf8');

code = code.replace(/\\\${/g, '${');

// Check the characters to be sure
fs.writeFileSync('D:/deploy_web/Khainguyenpharma/backend/src/config/resend.js', code, 'utf8');
console.log('Done!');
