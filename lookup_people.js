const pg = require("pg");
const moment = require("moment");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

client.connect((err) => {
  const userInput = process.argv[2];
  const query = `
    SELECT * FROM famous_people
    WHERE first_name = $1
    OR last_name = $1;
    `;

  if (err) {
    return console.error("Connection Error", err);
  } else if (userInput === undefined) {
    client.end();
    return console.log('Please provide a search query\n','e.g.: node lookup_people.js Ghandi');
  }

  client.query(query, [userInput], (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    result.rows.forEach(function(person) {
      const birth = moment(person.birthdate).format('YYYY-MM-DD')

      console.log(`- ${result.rowCount}: ${person.first_name} ${person.last_name}, born '${birth}'`);
    })
    client.end();
  });

  /*client.query('SELECT * FROM famous_people', (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }

      console.log(result);

    client.end();
  });*/

});