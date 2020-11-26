'use strict';
const fs = require('fs');

module.exports.main = async event => {
  const todoList = [];

  try {
    const { todo } = JSON.parse(event.body);
    if (!todo) {
        throw new Error (`Invalid payload, todo missing`);
    }

    if (fs.existsSync('./todo.json')){
      let existingTodo = fs.readFileSync('./todo.json');
      todoList.push(...JSON.parse(existingTodo.toString()));
    }

    todoList.forEach((item, index) => {
      if (item.todo === todo){
        todoList.splice(index, 1);
      }
    });
    
    fs.writeFileSync( './todo.json', JSON.stringify(todoList) );
    
    return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Todo deleted successfully!',
          data: todoList
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
