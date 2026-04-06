const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('API is working!');
});
let users = [
  { id: 1, name: 'Alic', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];
app.get('/users', (req, res) => {
  res.json(users);
});
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
      res.json(user);
});
app.post('/users', (req, res) => {
      const newUser = {
    id: users.length + 1,
        name: req.body.name,
    email: req.body.email
  };
    users.push(newUser);
      res.status(201).json(newUser);
});
app.put('/users/:id', (req, res) => {
      const user = users.find(u => u.id === parseInt(req.params.id));
        if (!user) return res.status(404).send('User not found');
          user.name = req.body.name;
  user.email = req.body.email;
    res.json(user);
});
app.delete('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).send('User not found');
  users.splice(userIndex, 1);
  res.status(204).send();
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});