const express = require('express');
const cors = require('cors');

//Create the server
const app = express();

//Choose the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Losing money on port ${PORT}`);
})