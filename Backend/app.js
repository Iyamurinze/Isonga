const express = require('express');
const cors = require('cors');
const sequelize = require('./db/dbs');
const app = express();
require('dotenv').config();

// Routes
const routes = require('./routes/transactions');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/v1', routes);

// Sync database
sequelize.sync()
.then(() => {
    console.log('Database Connected // Table created');
}).catch(err => {
    console.error('Error Connecting database:', err);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
