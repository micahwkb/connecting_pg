const moment = require("moment");
const settings = require("./settings"); // settings.json

const pg = require("knex")({
  client: 'pg',
  connection: {
    user     : settings.user,
    password : settings.password,
    database : settings.database,
    host     : settings.hostname,
    port     : settings.port,
    ssl      : settings.ssl
  },
  debug: false
});

const userInput = process.argv[2];

const printResults = function(result) {

  console.log(`Found ${result.length} person(s) by the name '${userInput}':`);
  let resultCount = 0;
  result.forEach(function(person) {
    // iterate row counter
    resultCount += 1;
    // format birthdate output
    const birth = moment(person.birthdate).format('YYYY-MM-DD')
    // format output string
    console.log(`- ${resultCount}: ${person.first_name} ${person.last_name}, born '${birth}'`);
  });
}


pg('famous_people')
.where('first_name', '=', userInput)
.orWhere('last_name', '=', userInput)
.then(function(result) {
  printResults(result)
  pg.destroy()
}).catch(function(error) {
  console.error(error)
});

/*
pg('famous_people')
.where('first_name', '=', userInput)
.orWhere('last_name', '=', userInput)
.asCallback(function(result) {console.log(result)})
.then(function() {
  pg.destroy()
})*/

