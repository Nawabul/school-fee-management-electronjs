const fs = require('fs');
const path = require('path');

const version = "3.4.3"; // Replace with your actual TailwindCSS version
const filePath = path.join(__dirname, '../node_modules/tailwindcss/lib/version.js');

try {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const content = `export default { version: "${version}" };`;

  fs.writeFileSync(filePath, content);

} catch (err) {

}
