import express from 'express';
import { nanoid } from 'nanoid';
import { MongoClient } from 'mongodb';

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'todo';
const collection = 'tasklist';

const app = express()
const port = 3000

await client.connect();
console.log("Connected sucessfully.");

app.get('/', async function (req, res) {
  res.send('Hmm?');
});

app.get('/health', async function (req, res) {
    res.status(200).send(
        {
            "Status" : "OK 👍",
            "Uptime" : process.uptime()
        }
    );
});

app.get('/healthcheck', async function (req, res) {
  res.status(200).send("OK 👍");
})

app.get("/api/todo/:id", async function (req, res){
  const id = req.params.id
  const result = await client.db(dbName).collection(collection).findOne(id);
  res.status(200).send(result);
});

app.post('/api/newtodo/:mail/:task', async function(req, res) {
  const email = req.params.mail;
  const task = req.params.task;
	const date = Date.now();
	const _id = nanoid();

  const dump = {
    _id,
    date,
    email,
    task
  };

  const result = await client.db(dbName).collection(collection).insertOne(dump);

  res.status(200).send(`Created a task with id ${result}`);
});

app.delete('/api/rmtodo/:id', async function (req, res) {
  const _id = req.params.id;
  await client.db(dbName).collection(collection).deleteOne({_id});

  res.status(200).send('Task successfully deleted.')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
