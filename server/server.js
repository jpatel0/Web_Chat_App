const path = require('path');
const express = require('express');
var app = express();
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 4444;
//console.log(publicPath);

/*app.get('/', (req,res) => {
  res.send(`${publicPath}\\index.html`);
});*/

app.use(express.static(publicPath));
app.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
