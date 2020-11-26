import React from "react";
import "./App.css";

function Todo({ todo, index, completeTodo, removeTodo }) {
  return (
    <div
      className="todo"
      style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
    >
      {todo.todo}
      <div>
        <button onClick={() => completeTodo(todo.todo)}>Complete</button>
        <button onClick={() => removeTodo(todo.todo)}>x</button>
      </div>
    </div>
  );
}

function TodoForm({ addTodo }) {
  const [value, setValue] = React.useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

function App() {
  const [todos, setTodos] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // React.useEffect(() => {

  // }, [newTodo]);

  React.useEffect(() => {
    fetch(
      `http://localhost:3000/prod/get_all_todo`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json"
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        setTodos(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        setIsError(true);
        setErrorMessage("Error when getting todos from db")
        setIsLoading(false);
      });
  }, [""]);


  const addTodo = text => {
    fetch(`http://localhost:3000/prod/create_todo`, {
      method: 'post', body:
        JSON.stringify({
          todo: text,
          isCompleted: false
        }),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(res => res.json()).then(res => {
        if (!res.data) {
          console.log(res.message);
          setErrorMessage(res.message);
          setTimeout(() => {
            setErrorMessage(null);
          }, 2000);
        }
        else {
          setTodos(res.data);
        }
      })
      .catch(error => {
        setIsError(true);
        setErrorMessage("Error when posting new todo in db");
        setIsLoading(false);
      });
  };

  const completeTodo = todo => {
    fetch(`http://localhost:3000/prod/mark_completed`, {
      method: 'put', body:
        JSON.stringify({
          todo
        }),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(res => res.json()).then(res => {
        if (!res.data) {
          setErrorMessage(res.message);
          setTimeout(() => {
            setErrorMessage(null);
          }, 2000);
        }
        else {
          setTodos(res.data);
        }
      })
      .catch(error => {
        setIsError(true);
        setErrorMessage("Error when setting todo to complete");
        setIsLoading(false);
      });
  };

  const removeTodo = todo => {
    console.log(todo)
    fetch(`http://localhost:3000/prod/delete_todo`, {
      method: 'delete', body:
        JSON.stringify({
          todo
        }),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(res => res.json()).then(res => {
        if (!res.data) {
          setErrorMessage(res.message);
          setTimeout(() => {
            setErrorMessage(null);
          }, 2000);
        }
        else {
          setTodos(res.data);
        }
      })
      .catch(error => {
        setIsError(true);
        setErrorMessage("Error when setting todo to complete");
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && <p>Loading Todo's from DB</p>}
      {isError && <p> {errorMessage} </p>}
      {!isLoading && !isError &&
        <div className="app">
          {errorMessage && <div> {errorMessage} </div>}
          <div className="todo-list">
            {todos.map((todo, index) => (
              <Todo
                key={index}
                index={index}
                todo={todo}
                completeTodo={completeTodo}
                removeTodo={removeTodo}
              />
            ))}
            <TodoForm addTodo={addTodo} />
          </div>
        </div>}
    </>
  );
}

export default App;