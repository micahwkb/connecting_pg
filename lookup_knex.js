const moment = require("moment");
const knex_configs = require("./knexfile").development;

const pg = require("knex")({
  client: 'pg',
  connection: knex_configs.connection,
  debug: false
});

const userInput = process.argv[2];

const printQueryResults = function(result) {

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
  pg.destroy();
}

const queryResultHandler = function(result) {
  console.log("Searching...")
  printQueryResults(result);
  // after printQueryResults, disconnect from pg
  // pg.destroy();
}

if (userInput) {
  pg('famous_people')
    .where('first_name', '=', userInput)
    .orWhere('last_name', '=', userInput)
    .then(queryResultHandler)
    .catch(function(error) {
      console.error(error)
  });
} else {
  console.log("Please provide a first or last name to search");
  pg.destroy();
}


