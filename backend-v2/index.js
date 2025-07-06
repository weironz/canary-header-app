const express = require('express');
const app = express();
app.get('/admin', (req, res) => {
  res.json({ version: 'v2', message: 'Hello from backend v2!' });
});
app.listen(3000, () => console.log('Backend v2 running on 3000'));
