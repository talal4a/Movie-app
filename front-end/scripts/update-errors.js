const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/pages/Account.jsx',
  'src/components/Features/ContinueWatching.jsx',
  'src/components/Features/Review.jsx',
  'src/components/Features/ReviewList.jsx',
  'src/components/Hero/Hero.jsx',
  'src/api/movies.js',
  'src/api/continueWatching.js',
  'src/api/user.js',
  'src/components/ui/AuthWatcher.jsx',
];

filesToUpdate.forEach((relativePath) => {
  const filePath = path.join(process.cwd(), relativePath);

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('import logger from')) {
      content = `import logger from '../utils/logger';\n${content}`;
    }

    content = content.replace(/console\.error/g, 'logger.error');

    content = content.replace(/console\.log/g, 'logger.log');

    content = content.replace(/console\.warn/g, 'logger.warn');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${relativePath}`);
  } catch (err) {
    console.error(`Error updating ${relativePath}:`, err.message);
  }
});

console.log('Error logging updates complete!');
