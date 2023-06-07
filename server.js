const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/NodeProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const phoneSchema = new mongoose.Schema({
  brand: String,
  model: String,
  year: Number,
  processor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Processor',
  },
});

const processorSchema = new mongoose.Schema({
  type: String,
  speed: Number,
});

const Phone = mongoose.model('Phone', phoneSchema);
const Processor = mongoose.model('Processor', processorSchema);

app.get('/phones', async (req, res) => {
  const phones = await Phone.find().populate('processor');
  res.json(phones);
});

app.get('/phones/:id', async (req, res) => {
  const phone = await Phone.findById(req.params.id).populate('processor');
  res.json(phone);
});

app.post('/phones', async (req, res) => {
  const phone = new Phone(req.body);
  await phone.save();
  res.json(phone);
});

app.put('/phones/:id', async (req, res) => {
  const phone = await Phone.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate('processor');
  res.json(phone);
});

app.delete('/phones/:id', async (req, res) => {
  const phone = await Phone.findByIdAndDelete(req.params.id).populate('processor');
  res.json(phone);
});

// define routes for CRUD operations on processors
app.get('/processors', async (req, res) => {
  const processors = await Processor.find();
  res.json(processors);
});

app.get('/processors/:id', async (req, res) => {
  const processor = await Processor.findById(req.params.id);
  res.json(processor);
});

app.post('/processors', async (req, res) => {
  const processor = new Processor(req.body);
  await processor.save();
  res.json(processor);
});

app.put('/processors/:id', async (req, res) => {
  const processor = await Processor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(processor);
});

app.delete('/processors/:id', async (req, res) => {
  const processor = await Processor.findByIdAndDelete(req.params.id);
  res.json(processor);
});

app.listen(PORT, () => {
  console.log('Server listening on port 3000');
});
