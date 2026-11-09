import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());


const client = new MongoClient(process.env.MONGO_DB_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoClient = await connectToMongoDB();
const database = mongoClient.db('wonderlust');
const destinationsCollection = database.collection('destinations');
const bookingsCollection = database.collection('bookings');


app.post('/add-destination', async (req, res) => {
  const data = req.body;
  const result = await destinationsCollection.insertOne(data);
  console.log(result);
  console.log(data);
  res.send(result);
})

app.get('/all-destinations', async (req, res) => {
  const result = await destinationsCollection.find({}).toArray();
  res.send(result);
});

app.get('/all-destination/:id', async (req, res) => {
  const { id } = req.params;
  const result = await destinationsCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
})


app.patch('/all-destination/:id', async (req, res) => {
  const { id } = req.params;
  const UpdateData = req.body;
  const result = await destinationsCollection.updateOne({ _id: new ObjectId(id) }, { $set: UpdateData });
  res.send(result);
});

app.delete('/all-destination/:id', async (req, res) => {
  const { id } = req.params;
  const result = await destinationsCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

app.post('/booking', async (req, res) => {
  const data = req.body;
  const result = await bookingsCollection.insertOne(data);
  res.send(result);
});


app.get('/my-bookings/:email', async (req, res) => {
  const { email } = req.params;
  // Booking docs store the owner in `userEmail` (set by POST /booking), not `user`.
  const result = await bookingsCollection.find({ userEmail: email }).toArray();
  res.send(result);
});

app.delete('/my-bookings/:id', async (req, res) => {
  const { id } = req.params;
  const result = await bookingsCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});



app.get('/', (req, res) => {
  res.send({ message: 'server is running fine!' });
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});