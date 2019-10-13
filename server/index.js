const express = require('express');
const app = express()
const port = 3000

app.use(express.json());

const indexRouter = require('./routes/index');
const schnorrRoutes = require('./routes/schnorr');


app.use('/', indexRouter);
app.use('/protocols/sis', schnorrRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      name: err.name,
      message: err.message,
      data: err.data,
    },
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))