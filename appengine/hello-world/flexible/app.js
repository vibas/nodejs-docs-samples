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
  .limit(10);
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

/**
 * Insert a user record into the database.
 *
 * @param {object} user The user record to insert.
 */
const insertUser = user => {
  return datastore.save({
    key: datastore.key('users'),
    data: user,
  });
};

app.get('/setusertodb', async (req, res, next) => {
  // Create a user record to be stored in the database
  const user = {
    address: "Test Address",
    age: 50,
    name: "Test User Name"
  };

  try {
    await insertUser(user);
    res
      .status(200)
      .set('Content-Type', 'text/plain')
      .send("Database updated with new user data!")
      .end();
  } catch (error) {
    next(error);
  }
});

module.exports = app;
