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

/*
  Query postgres with user input
*/
const runQuery = function(callback) {

  client.connect((err) => {
    // grab (single) user input value from terminal
    const userInput = process.argv[2];
    // look for matches on first or last name
    const query = `
      SELECT * FROM famous_people
      WHERE first_name = $1
      OR last_name = $1;
      `;

    if (err) {
      return console.error("Connection Error", err);
      // provide instructions if there was no user input
    } else if (userInput === undefined) {
      client.end();
      return console.log('Please provide a search query\n','e.g.: node lookup_people.js Gandhi');
    }

    client.query(query, [userInput], (err, result) => {
      if (err) {
        return console.error("error running query", err);
      } else if (result.rows.length > 0) {
        // if there was at least one search hit
        console.log("Searching...");
        callback(err, result, userInput);
        client.end();
      } else {
        console.log("There were no results")
      }
    });
  });
}

/*
  Print results of valid query
*/
const printResults = function(err, result, userInput) {

  console.log(`Found ${result.rows.length} person(s) by the name '${userInput}':`);
  let resultCount = 0;
  result.rows.forEach(function(person) {
    // iterate row counter
    resultCount += 1;
    // format birthdate output
    const birth = moment(person.birthdate).format('YYYY-MM-DD')
    // format output string
    console.log(`- ${resultCount}: ${person.first_name} ${person.last_name}, born '${birth}'`);
  });
}

runQuery(printResults);