const express = require('express');
const app = express();
app.get('/admin', (req, res) => {
  res.json({ version: 'v1', message: 'Hello from backend v1!' });
});
app.listen(3000, () => console.log('Backend v1 running on 3000'));
