const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'src');

// Find all JavaScript/JSX/TS/TSX files
const files = [];
function findFiles(dir) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findFiles(fullPath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(item)) {
      files.push(fullPath);
    }
  });
}

findFiles(rootDir);

// Update imports
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const updatedContent = content.replace(
    /from ['"]@?\/?[^'"\/]*\/axioInstance['"]/g,
    'from "@/api/axiosInstance"'
  );
  
  if (content !== updatedContent) {
    fs.writeFileSync(file, updatedContent, 'utf8');
    console.log(`Updated imports in ${path.relative(rootDir, file)}`);
  }
});

console.log('Import updates complete!');
