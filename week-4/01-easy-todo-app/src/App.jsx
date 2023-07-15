import { useEffect, useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

async function getInitialTodos() {
  console.log('Inside getInitialTodos');
    
  const response = await axios.get('http://localhost:3000/todos');
  const initialTodos = response.data;

  return initialTodos
}

function addTodo(newTodoTitle, currentTodos, updateTodoFunction) {
  console.log('Inside addTodo');

  const postData = {
    'title': newTodoTitle,
    'description': ''
  }

  axios.post('http://localhost:3000/todos', postData).then((response) => {
    const id = response.id;
    const newTodo = {
      id,
      ...postData
    };
    const updatedTodos = [ ...currentTodos, postData ];
    updateTodoFunction(updatedTodos);
  })

}

function deleteTodo(id, currentTodos, updateTodoFunction) {
  console.log('Inside deleteTodo');

  axios.delete('http://localhost:3000/todos/' + id.toString());

  const updatedTodos = currentTodos.filter((val) => val.id !== id);
  updateTodoFunction( updatedTodos );
}

function App() {

  console.log('Inside App');

  var [todos, setTodos] = useState( [] );

  // Fetching the initial todos
  useEffect( () => {
    console.log('Inside useEffect');
    getInitialTodos().then(initialTodos => setTodos(initialTodos));
  }, [] );

  function handleInput(event) {
    console.log('Inside handleInput');
    if (event.key == 'Enter') {
      const newTodoTitle = event.target.value;
      addTodo(newTodoTitle, todos, setTodos);
    }
  }

  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input type="text" onKeyDown={handleInput} />
      </div>
      <div>
        {todos.map((val, idx) => (
          <Todo key={idx} id={val.id} title={val.title} currentTodos={todos} updateTodoFunction={setTodos} description={val.description}></Todo>
        ))}
      </div>
    </>
  )
}

function Todo(props) {
  console.log('Inside Todo Component');

  // Add a delete button here so user can delete a TODO.
  return <div>
      <span>{props.title}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <span>
        <button onClick={() => deleteTodo(props.id, props.currentTodos, props.updateTodoFunction)}>Delete</button>
      </span>
  </div>
}

export default App
