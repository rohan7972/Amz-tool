import knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

const db = knex(config);

// Bind all Models to the knex instance. You only
// need to do this once before you use any of
// your model classes.
Model.knex(db);

export default db;
