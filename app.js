const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use('/static', express.static('public'));
app.set('view engine', 'pug')

const mainRoutes = require('./routes')
const cardRoutes = require('./routes/cards')

app.use(mainRoutes);
app.use('/cards', cardRoutes);

app.use((req, res, next) => {
  const err = new Error('Page not found')
  err.status = 404;
  next(err)
})

// runs when next() is passed an error object
app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status)
  res.render('error')
})

app.listen(3000, () => console.log('App running on port 3000'));
