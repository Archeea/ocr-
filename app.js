const express = require('express');
const Tesseract = require('tesseract.js');
const fs = require('fs');

const app = express();
const port = 3000;

const keywords = ['pipe', 'banana', 'apple', 'carrot', 'book', ];

app.get('/', (req, res) => {
 
  const imageBuffer = fs.readFileSync('ocr.png');

  
  Tesseract.recognize(
    imageBuffer,
    'eng',
    { logger: (info) => console.log(info) }
  ).then(({ data: { text } }) => {
   
    let closestMatch = '';
    let minDistance = Number.MAX_VALUE;

    
    for (const keyword of keywords) {
      const distance = levenshteinDistance(text, keyword);
      if (distance < minDistance) {
        minDistance = distance;
        closestMatch = keyword;
      }
    }

    res.send(`Recognized Text: ${text}<br>Closest Match: ${closestMatch}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0) dp[i][j] = j;
      else if (j === 0) dp[i][j] = i;
      else {
        const cost = s1[i - 1] !== s2[j - 1] ? 1 : 0;
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + cost,
          dp[i][j - 1] + 1,
          dp[i - 1][j] + 1
        );
      }
    }
  }
  return dp[m][n];
}
