'use strict';

// [START gae_flex_quickstart]
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

// Get User Endpoint to get userdata in JSON format
app.get('/getdummyuser', (req,res) => {
  var userdata = {
    username : "Vibas",
    userID : 100,
    address : "Pune",
    phone : 1009008909
  }
  res.status(200).send(userdata).end();
});

// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_flex_quickstart]

const {Datastore} = require("@google-cloud/datastore");
const datastore = new Datastore({
  projectId : "mydailylifehelper-1",
  databaseId : "mydailylifehelperuser"
});

const getUsersFromDataStore = () => {
  const query = datastore
  .createQuery('users')
  .order('name', {descending: true})
  .limit(5);
  return datastore.runQuery(query);
};

// Call GetUsersFromDB function to get all users entries from datastore
app.get('/getusersfromdb', async (req, res, next) => {
  try {
    const [entities] = await getUsersFromDataStore();
    const users = entities.map(
      entity => `Name - ${entity.name} | Age - ${entity.age} | Address - ${entity.address}`
    );
    res.status(200)
    .set('Content-Type', 'text/plain')
    .send(users.join('\n'))
    .end();
  } catch (error) {
    next(error);
  }
  });

module.exports = app;
