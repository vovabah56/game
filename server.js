const express = require('express');
const path = require('path');

const app = express();

app.use('/public', express.static(path.resolve(__dirname, "public")));


app.use('/libs', express.static(path.resolve(__dirname, 'libs')));
app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname,  './map.html'));
});

app.listen(8001, () => console.log('ok'));
