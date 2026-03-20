const express = require('express');
const app = express();
try {
  const userRoutes = require('./routes/userRoutes');
  console.log('userRoutes successfully required');
  console.log('userRoutes type:', typeof userRoutes);
  console.log('userRoutes is Router:', typeof userRoutes.handle === 'function' || userRoutes.name === 'router');
  
  app.use('/api/users', userRoutes);
  console.log('app.use(/api/users) executed');
  
  const routes = [];
  app._router.stack.forEach(layer => {
    if (layer.name === 'router') {
      console.log('Found router layer');
      layer.handle.stack.forEach(s => {
        if (s.route) {
          console.log('Found route in router:', s.route.path);
        }
      });
    }
  });
} catch (err) {
  console.error('Error in diagnostic:', err);
}
process.exit();
