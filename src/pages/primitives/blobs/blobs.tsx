import React, { useState, useEffect } from "react";
import Nav from "~/components/Nav";

interface Todo {
  key: string;
  value: string;
}

export default function Blobs() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTodos();

    async function getTodos() {
      setLoading(true);
      const response = await fetch("/api/blob", {
        method: "GET",
      });
      const data = await response.json();
      setTodos(data);
      setLoading(false);
    }
  }, []);

  async function updateTodos(t: Todo[]) {
    await fetch("/api/blob", {
      method: "PUT",
      body: JSON.stringify(t),
    });
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      const newTodos = [
        ...todos,
        { key: new Date().toISOString(), value: newTodo },
      ];
      setTodos(newTodos);
      updateTodos(newTodos);
      setNewTodo("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleDeleteTodo = async (key: string) => {
    const t = todos.filter((todo) => todo.key !== key);
    updateTodos(t);
    setTodos(t);
  };

  return (
    <>
      <Nav title="Blob Storage" />
      <main>
        <div className="page-header">
          <h1>Blob Storage</h1>
          <p>Persistent key-value storage with Netlify Blobs</p>
        </div>

        <section>
          <h2>Todo List</h2>
          <div className="todo-input">
            <input
              type="text"
              value={newTodo}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Add a new todo..."
            />
            <button onClick={handleAddTodo}>Add</button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : todos.length === 0 ? (
            <p>No todos yet. Add one above.</p>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.key} className="todo-item">
                  <span>{todo.value}</span>
                  <button onClick={() => handleDeleteTodo(todo.key)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
