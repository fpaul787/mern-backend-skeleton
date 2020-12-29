const express = require('express');
const connectDB = require('./database');
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json({ extended: false }));
app.get('/', (req, res) => res.send('API Running'));


// Define Routes
app.use('/api/users', require('./routes/api/users.routes'));
app.use('/api/auth', require('./routes/api/auth.routes'));
app.use('/api/profile', require('./routes/api/profile.routes'));
app.use('/api/posts', require('./routes/api/posts.routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));