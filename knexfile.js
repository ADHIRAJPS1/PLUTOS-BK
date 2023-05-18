require("dotenv").config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
// Update with your config settings.
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: DB_HOST,
      user: DB_USER, // replace with your mysql username
      password: DB_PASSWORD, // replace with your mysql password
      database: DB_DATABASE,
      typeCast: function castField(field, useDefaultTypeCasting) {

        // We only want to cast bit fields that have a single-bit in them. If the field
        // has more than one bit, then we cannot assume it is supposed to be a Boolean.
        if ((field.type === "BIT") && (field.length === 1)) {

          var bytes = field.buffer();

          // A Buffer in Node represents a collection of 8-bit unsigned integers.
          // Therefore, our single "bit field" comes back as the bits '0000 0001',
          // which is equivalent to the number 1.

          return (bytes[0] === 1);

        }

        return (useDefaultTypeCasting());

      }
    },
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds"
    },
    debug: true
  },

  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

};
