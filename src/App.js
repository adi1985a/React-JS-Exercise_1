import React, { useState, useEffect } from 'react';
import './App.css';

const HEADER_IMAGE = 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80';
const PRIORITIES = ['High', 'Medium', 'Low'];

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [editingText, setEditingText] = useState('');
  const [editingPriority, setEditingPriority] = useState('Medium');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  const [view, setView] = useState('tasks');

  const addTask = () => {
    if (task.trim() !== '') {
      setTodos([
        ...todos,
        { text: task, done: false, editing: false, priority }
      ]);
      setTask('');
      setPriority('Medium');
    } else {
      alert('Cannot add an empty task!');
    }
  };

  const deleteTodo = (index) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const newTodos = [...todos];
      newTodos.splice(index, 1);
      setTodos(newTodos);
    }
  };

  const toggleDone = (index) => {
    const newTodos = [...todos];
    newTodos[index].done = !newTodos[index].done;
    setTodos(newTodos);
  };

  const editTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].editing = true;
    setEditingText(newTodos[index].text);
    setEditingPriority(newTodos[index].priority);
    setTodos(newTodos);
  };

  const saveTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].text = editingText;
    newTodos[index].priority = editingPriority;
    newTodos[index].editing = false;
    setTodos(newTodos);
  };

  const clearCompleted = () => {
    if (window.confirm('Clear all completed tasks?')) {
      setTodos(todos.filter((todo) => !todo.done));
    }
  };

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  let filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'done':
        return todo.done;
      case 'undone':
        return !todo.done;
      default:
        return true;
    }
  });

  if (sort === 'priority') {
    filteredTodos = [...filteredTodos].sort((a, b) => PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority));
  } else if (sort === 'alpha') {
    filteredTodos = [...filteredTodos].sort((a, b) => a.text.localeCompare(b.text));
  } else if (sort === 'status') {
    filteredTodos = [...filteredTodos].sort((a, b) => a.done - b.done);
  }

  const doneCount = todos.filter((t) => t.done).length;
  const leftCount = todos.length - doneCount;

  return (
    <div className="container">
      <nav className="main-nav">
        <div className="logo" onClick={() => setView('home')}>ToDoApp</div>
        <ul>
          <li className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>Home</li>
          <li className={view === 'tasks' ? 'active' : ''} onClick={() => setView('tasks')}>Tasks</li>
          <li className={view === 'about' ? 'active' : ''} onClick={() => setView('about')}>About</li>
        </ul>
      </nav>
      {view === 'home' && (
        <div className="header-image" style={{ backgroundImage: `url(${HEADER_IMAGE})` }}>
          <h1>Welcome to To-Do App</h1>
          <p className="subtitle">Stay organized and productive with a modern, stylish task manager.</p>
        </div>
      )}
      {view === 'tasks' && (
        <>
          <div className="header-image" style={{ backgroundImage: `url(${HEADER_IMAGE})` }}>
            <h1>To-Do List</h1>
            <p className="subtitle">Manage your tasks efficiently</p>
          </div>
          <div className="stats-bar">
            <span>Done: <b>{doneCount}</b></span>
            <span>Left: <b>{leftCount}</b></span>
            <button className="clear-btn" onClick={clearCompleted} disabled={doneCount === 0}>Clear Completed</button>
          </div>
          <div className="add-bar">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Add a task..."
            />
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button onClick={addTask}>Add</button>
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="done">Done</option>
              <option value="undone">Undone</option>
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="priority">Sort: Priority</option>
              <option value="alpha">Sort: A-Z</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>
          <ul className="todo-list">
            {filteredTodos.map((todo, index) => (
              <li key={index} className={`todo-item${todo.done ? ' done' : ''} priority-'${todo.priority.toLowerCase()}'`}>
                {todo.editing ? (
                  <>
                    <input
                      type="text"
                      value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      placeholder="Edit task..."
                    />
                    <select value={editingPriority} onChange={e => setEditingPriority(e.target.value)}>
                      {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <button className="save-btn" onClick={() => saveTodo(index)}>Save</button>
                  </>
                ) : (
                  <>
                    <span className="todo-text">{todo.text}</span>
                    <span className={`priority-label priority-${todo.priority.toLowerCase()}`}>{todo.priority}</span>
                    <button className="delete-btn" onClick={() => deleteTodo(index)}>Delete</button>
                    <button className="toggle-btn" onClick={() => toggleDone(index)}>
                      {todo.done ? 'Mark as Undone' : 'Mark as Done'}
                    </button>
                    <button className="edit-btn" onClick={() => editTodo(index)}>Edit</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {view === 'about' && (
        <div className="about-section">
          <h1>About This App</h1>
          <p>This is a modern, stylish To-Do List app built with React. It features task priorities, sorting, filtering, a beautiful Unsplash background, and a responsive blue-white-black theme. Stay organized and productive!</p>
          <p>Created by Adrian Lesniak.</p>
        </div>
      )}
      <footer className="footer">Inspired by productivity. Background photo by <a href="https://unsplash.com/photos/a-piece-of-paper-with-the-words-to-do-list-on-it-Ki0-ea-Hgx4" target="_blank" rel="noopener noreferrer">Annie Spratt</a> on Unsplash.</footer>
    </div>
  );
}

export default App;
