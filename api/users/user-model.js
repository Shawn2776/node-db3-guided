const db = require('../../data/db-config.js')

module.exports = {
  findPosts,
  find,
  findById,
  add,
  remove
}

async function findPosts(user_id) {
  const rows = await db("posts as p")
  .join("users as u","u.id","p.user_id")
  .select("p.id as post_id","u.username","p.contents")
  .where({user_id})
  return rows
  /*
    Implement so it resolves this structure:

    [
      {
          "post_id": 10,
          "contents": "Trusting everyone is...",
          "username": "seneca"
      },
      etc
    ]
  */
}

async function find() {
  const rows = await db("users as u")
  .leftJoin("posts as p","u.id","p.user_id")
  .groupBy("u.id")
  .select("u.id as user_id","u.username")
  .count("p.id as post_count")
  return rows
  /*
    Improve so it resolves this structure:

    [
        {
            "user_id": 1,
            "username": "lao_tzu",
            "post_count": 6
        },
        {
            "user_id": 2,
            "username": "socrates",
            "post_count": 3
        },
        etc
    ]
  */
}

async function findById(id) {
  const rows = await db("users as u")
  .leftJoin("posts as p","u.id","p.user_id")
  .select(
    "u.id as user_id",
    "u.username",
    "p.id as post_id",
    "p.contents"
  )
  .where("u.id",id)
  
  let result = { posts:[]}

  for(let record of rows){
    if(!result.username){
      result.user_id = record.user_id
      result.username = record.username
    }
    
  }

  /*
    Improve so it resolves this structure:

    {
      "user_id": 2,
      "username": "socrates"
      "posts": [
        {
          "post_id": 7,
          "contents": "Beware of the barrenness of a busy life."
        },
        etc
      ]
    }
  */
}

function add(user) {
  return db('users')
    .insert(user)
    .then(([id]) => { // eslint-disable-line
      return findById(id)
    })
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del()
}
