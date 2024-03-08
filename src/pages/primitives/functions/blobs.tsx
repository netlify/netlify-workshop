import { getStore } from '@netlify/blobs';
import React, { useState } from 'react';
import { useEffect } from 'react';

interface Todo {
  key: string;
  value: string;
}

export default function Blobs() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');


  const handleInputChange = (event: any) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = async () => {
    const store = getStore("ntl-workshop-todos");
    if (newTodo.trim() !== '') {
      const newTodos = [...todos, { key: new Date().toISOString(), value: newTodo }];
      await store.set("todos", JSON.stringify(newTodos));
      setTodos(newTodos);
      setNewTodo('');
    }
  };

  const handleDeleteTodo = async (key: string) => {
    const store = getStore("ntl-workshop-todos");
    const t = todos.filter((todo) => todo.key !== key);
    await store.set("todos", JSON.stringify(t));
    setTodos(t);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input type="text" value={newTodo} onChange={handleInputChange} />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.key}>
            {todo.value}
            <button onClick={() => handleDeleteTodo(todo.key)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}