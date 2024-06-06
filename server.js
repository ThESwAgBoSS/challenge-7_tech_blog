const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Session setup
const sess = {
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 3600000 }, // 1 hour
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    }),
};

app.use(session(sess));

// Handlebars setup
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/users', require('./controllers/api/userRoutes'));
app.use('/api/posts', require('./controllers/api/postRoutes'));
app.use('/api/comments', require('./controllers/api/commentRoutes'));
app.use('/', require('./controllers/homeRoutes'));

// Database connection and server start
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});