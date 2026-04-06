const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

/* ===== MongoDB Connection ===== */
mongoose.connect('mongodb://localhost:27017/Test1')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

/* ===== Schema & Model ===== */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

/* ===== Routes ===== */
app.get('/', (req, res) => {
  res.send('MongoDB API is working!');
});

/* GET all users */
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET user by ID */
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch {
    res.status(400).json({ message: 'Invalid ID' });
  }
});

/* CREATE user */
app.post('/users', async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE user */
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch {
    res.status(400).json({ message: 'Invalid ID' });
  }
});

/* DELETE user */
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(204).send();
  } catch {
    res.status(400).json({ message: 'Invalid ID' });
  }
});

/* ===== Start Server ===== */
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});