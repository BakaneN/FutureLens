const { spawn } = require('child_process');
const path = require('path');
const { db } = require('../firebase'); // ✅ Correct import

const getCareerInfo = async (req, res) => {
  const { career } = req.body;
  const user = req.user; // Comes from auth middleware

  console.log('Incoming career:', career);

  if (!career) {
    return res.status(400).json({ error: 'Career is required' });
  }

  if (!user || !user.uid) {
    return res.status(401).json({ error: 'Unauthorized: Missing user info' });
  }

  const pythonPath = path.join(__dirname, '../../.venv/bin/python');
  const scriptPath = path.join(__dirname, '../../scraper/scrape.py');
  console.log('Running Python:', pythonPath, scriptPath);

  const python = spawn(pythonPath, [scriptPath]);
  let dataToSend = '';
  let errorOutput = '';

  python.stdout.on('data', (data) => {
    console.log('stdout:', data.toString());
    dataToSend += data.toString();
  });

  python.stderr.on('data', (data) => {
    console.error('stderr:', data.toString());
    errorOutput += data.toString();
  });

  python.on('close', async (code) => {
    console.log('Python script exited with code:', code);

    try {
      const lastLine = dataToSend.trim().split('\n').pop();
      const json = JSON.parse(lastLine);

      // Save result under the logged-in user
      await db
        .collection('users')
        .doc(user.uid)
        .collection('careerSearches')
        .add({
          career: json.career,
          result: json.intro || json.dayInLife || 'No info available',
          searchedAt: new Date(),
        });

      console.log(`Career saved for user: ${user.uid}`);
      res.status(200).json(json);
    } catch (err) {
      console.error('Parsing or Firestore error:', err);
      res.status(500).json({ error: 'Failed to parse or save career info' });
    }
  });

  python.stdin.write(`${career}\n`);
  python.stdin.end();
};

module.exports = { getCareerInfo };
