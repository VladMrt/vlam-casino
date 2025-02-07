const express = require('express')
const app = express()
const path = require('path')
const port = 8080

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'MainPage.html'));
});

app.get('/GeekWheel', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'GeekWheel.html'));
});

app.get('/DiliMiniSlots', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'DiliMiniSlots.html'));
});

app.get('/JoculCalamarului', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'JoculCalamarului.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})