const pg = require("pg");
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
  if (err) {
    return console.error("Connection Error", err);
  }
  var id = "10";
  /*client.query("SELECT * FROM famous_people WHERE id = $1", [id], (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }

    console.log(result.rows); //output: 1
    client.end();
  });
*/
  client.query("SELECT * FROM famous_people;", (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    result.rows.forEach(function(person) {

      console.log(person.first_name, person.last_name); //output: 1
    })
    client.end();
  });

});