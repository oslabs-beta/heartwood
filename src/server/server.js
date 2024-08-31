const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

// check the folder 
app.use(express.static(path.resolve(__dirname, '..', '..', 'dist')));

// handling incoming request bodies as JSON
app.use(express.json());

// cookie parser - populate req.cookies
app.use(cookieParser());

console.log('line 15')


app.get('/', (req, res) => {
  console.log('line 19')
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'))
}); // Serve from the current directory


// catch-all route handler for any requests to an unknown route
app.use('*', (req, res) => {
  console.log('catch-all route handler is executed');
  return res.status(200).sendFile(__dirname, '..', '..', 'dist', 'index.html');  
});

//unknown route handler
//replace 404 with index.html ---create a 404 page inside of react router
app.use('*', (req, res) => res.sendStatus(404));

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));

module.exports = app;