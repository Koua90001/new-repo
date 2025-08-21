const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/final_project';

mongoose.connect(uri)
  .then(() => console.log('Mongo connected'))
  .catch((e) => console.error('Mongo connection error', e));

module.exports = mongoose;
