'use strict';
const fs = require('fs');

module.exports.main = async event => {
  const todoList = [];

  try {

    if (fs.existsSync('./todo.json')){
      let existingTodo = fs.readFileSync('./todo.json');
      todoList.push(...JSON.parse(existingTodo.toString()));
    }    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'success',
        data: todoList,
      })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
        data: JSON.stringify({ error }),
      })
    };
  }
};
