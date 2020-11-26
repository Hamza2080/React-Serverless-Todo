'use strict';
const fs = require('fs');

module.exports.main = async event => {
  const todoList = [];

  try {
    const { isCompleted, todo } = JSON.parse(event.body);
    if (!todo) {
      throw new Error (`Invalid payload, missing todo`);
    }

    if (fs.existsSync('./todo.json')){
      let existingTodo = fs.readFileSync('./todo.json');
      todoList.push(...JSON.parse(existingTodo.toString()));
    }

    let isTodoAlreadyExist = todoList.find(item => item.todo === todo);
    if (isTodoAlreadyExist) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Todo already exist',
          data: null
        })
      };
    }

    todoList.push({
      isCompleted : isCompleted || false,
      todo
    });

    fs.writeFileSync( './todo.json', JSON.stringify(todoList) );
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'success',
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
