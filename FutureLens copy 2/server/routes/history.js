const express = require('express');
const router = express.Router();
const { db } = require('../firebase'); // ✅ Correct import
const verifyAuth = require('../Middleware/auth');

router.get('/', verifyAuth, async (req, res) => {
  const uid = req.user.uid;

  try {
    const snapshot = await db
      .collection('users')
      .doc(uid)
      .collection('careerSearches')
      .orderBy('searchedAt', 'desc')
      .limit(10)
      .get();

    const history = snapshot.docs.map(doc => doc.data());
    res.status(200).json(history);
  } catch (err) {
    console.error('Error fetching user history:', err);
    res.status(500).json({ error: 'Failed to fetch user history' });
  }
});

module.exports = router;
