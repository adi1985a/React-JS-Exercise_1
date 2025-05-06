import React, { useState, useEffect } from 'react';
import './App.css';

function App() 
{
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState('all');

  const addTask = () => 
  {
    if (task.trim() !== '') {
      setTodos([...todos, { text: task, done: false, editing: false }]);
      setTask('');
    } else {
      alert('Nie można dodać pustego zadania!');
    }
  };

  const deleteTodo = (index) => 
  {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const toggleDone = (index) => 
  {
    const newTodos = [...todos];
    newTodos[index].done = !newTodos[index].done;
    setTodos(newTodos);
  };

  const editTodo = (index) => 
  {
    const newTodos = [...todos];
    newTodos[index].editing = true;
    setEditingText(newTodos[index].text);
    setTodos(newTodos);
  };

  const saveTodo = (index) => 
  {
    const newTodos = [...todos];
    newTodos[index].text = editingText;
    newTodos[index].editing = false;
    setTodos(newTodos);
  };

  useEffect(() => 
  {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) 
    {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => 
  {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = todos.filter((todo) => 
  {
    switch (filter) 
    {
      case 'done':
        return todo.done;
      case 'undone':
        return !todo.done;
      default:
        return true;
    }
  });

  return (
    <div>
      <h1>Lista zadań</h1>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Dodaj zadanie"
          style={{ width: '70%', marginRight: '10px' }}
        />

        <button onClick={addTask}>Dodaj</button>

        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginLeft: '10px' }}>
          <option value="all">Wszystkie</option>
          <option value="done">Wykonane</option>
          <option value="undone">Niewykonane</option>
        </select>
      </div>

      <ul>
        {filteredTodos.map((todo, index) => (
          <li key={index} className={todo.done ? 'done' : ''}>
            {todo.editing ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  placeholder="Edytuj zadanie"
                />

                <button
                  style={{ backgroundColor: '#4CAF50', marginLeft: '5px' }}
                  onClick={() => saveTodo(index)}
                >
                  Zapisz
                </button>
              </>
            ) : (
              <>
                <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                  {todo.text}
                </span>

                <button onClick={() => deleteTodo(index)} style={{ marginLeft: '5px' }}>
                  Usuń
                </button>

                <button
                  onClick={() => toggleDone(index)}
                  style={{ marginLeft: '5px', textDecoration: 'none' }}
                >
                  {todo.done ? 'Oznacz jako niewykonane' : 'Oznacz jako wykonane'}
                </button>

                <button
                  style={{ backgroundColor: '#4CAF50', marginLeft: '5px' }}
                  onClick={() => editTodo(index)}
                >
                  Edytuj
                </button>
                
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
