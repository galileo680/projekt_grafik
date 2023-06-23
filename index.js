const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user');
const grafikRoutes = require('./routes/schedule');

const app = express();

const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(userRoutes);
app.use('/grafik', grafikRoutes);

app.listen(PORT, () => console.log(`Serve running on port ${PORT}`));
