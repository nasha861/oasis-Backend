const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");

  
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'oasis-energy-api' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/technicians', require('./routes/technicianRoutes'));
app.use('/api/installations', require('./routes/installationRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/solar-products', require('./routes/solarProductRoutes'));
app.use('/api/system-packages', require('./routes/systemPackageRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/project', require('./routes/projectRoute'));
app.use('/api/energy', require('./routes/energyRoutes'));
app.use("/api/orders", require('./routes/orderRoutes'));

app.use("/api/payments", paymentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
