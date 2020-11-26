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

    let existingTodo = todoList.find((item) => {
        if (item.todo === todo) {
            item.isCompleted = true;
            return item;
        }
    });
    if (!existingTodo) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Todo not found',
          data: null
        })
      };
    }
    
    fs.writeFileSync( './todo.json', JSON.stringify(todoList) );
    
    return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Todo updated successfully!',
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
