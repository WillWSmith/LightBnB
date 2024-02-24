const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const query = {
    text: `SELECT * FROM users WHERE email = $1`,
    values: [email]
  };

  return pool.query(query)
    .then((res) => {
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0];
    })
    .catch((err) => {
      console.error('query error', err);
      throw err;
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const query = {
    text: `SELECT * FROM users WHERE id = $1`,
    values: [id]
  };

  return pool.query(query)
    .then((res) => {
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0];
    })
    .catch((err) => {
      console.error('query error', err);
      throw err;
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const query = {
    text: `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
    values: [user.name, user.email, user.password]
  };

  return pool.query(query)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      console.error('query error', err);
      throw err;
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  console.log('guest_id:', guest_id,)

  const query = {
    text: `
      SELECT reservations.id,
             reservations.start_date,
             reservations.end_date,
             reservations.property_id,
             properties.title,
             properties.cost_per_night,
             properties.thumbnail_photo_url,
             properties.city,
             AVG(property_reviews.rating) AS average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    LEFT JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY reservations.start_date DESC
    LIMIT $2;
    `,
    values: [guest_id, limit]
  };

  return pool.query(query)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      console.error('query error', err);
      throw err;
    });

};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  let query = `
    SELECT properties.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id 
  `;
  
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    query += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    if (queryParams.length === 0) {
      query += `WHERE `;
    } else {
      query += `AND `;
    }
    queryParams.push(options.owner_id);
    query += `owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    if (queryParams.length === 0) {
      query += `WHERE `;
    } else {
      query += `AND `;
    }
    queryParams.push(options.minimum_price_per_night);
    queryParams.push(options.maximum_price_per_night);
    query += `cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    if (queryParams.length === 0) {
      query += `WHERE `;
    } else {
      query += `AND `;
    }
    queryParams.push(options.minimum_rating);
    query += `AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  query += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  console.log(query, queryParams);

  return pool.query(query, queryParams)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      console.error('query error', err);
      throw err;
    });

};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
