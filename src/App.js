import styles from "./app.module.css";
import { useState } from "react";
import {
  useRequestGetTodos,
  useRequestAddTodo,
  useRequestUpdateTodo,
  useRequestDeleteTodo,
} from "./hooks";

export const App = () => {
  const refreshTodos = () => setRefreshTodosFlag(!refreshTodosFlag);
  const [refreshTodosFlag, setRefreshTodosFlag] = useState(false);

  const { isLoading, todos } = useRequestGetTodos(refreshTodosFlag);
  const { isCreating, requestAddTodo } = useRequestAddTodo(refreshTodos);
  const { isUpdating, requestUpdateTodo } = useRequestUpdateTodo(refreshTodos);
  const { isDeleting, requestDeleteTodo } = useRequestDeleteTodo(refreshTodos);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [sorted, setSorted] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoTitle, setEditedTodoTitle] = useState("");

  const handleSearchChange = (e) => {
    setSearchPhrase(e.target.value);
  };

  const handleSortToggle = () => {
    setSorted(!sorted);
  };

  const handleAddTodo = () => {
    if (newTodoTitle) {
      requestAddTodo(newTodoTitle);
      setNewTodoTitle("");
    }
  };

  const handleEditTodo = (id) => {
    setEditingTodoId(id);
    const todoToEdit = todos.find((todo) => todo.id === id);
    setEditedTodoTitle(todoToEdit.title);
  };

  const handleUpdateTodo = (id, updatedTitle) => {
    requestUpdateTodo(id, updatedTitle);
    setEditingTodoId(null);
  };

  const handleDeleteTodo = (id) => {
    requestDeleteTodo(id);
  };

  let sortedTodos = [...todos];

  if (sorted) {
    sortedTodos = sortedTodos.sort((a, b) => a.title.localeCompare(b.title));
  }

  const filteredTodos = sortedTodos.filter((todo) =>
    todo.title.toLowerCase().includes(searchPhrase.toLowerCase())
  );

  return (
    <div className={styles.app}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search in todos"
          value={searchPhrase}
          onChange={handleSearchChange}
        />
        <button onClick={handleSortToggle}>
          {sorted ? "Sorting off" : "A - Z Sorting"}
        </button>
      </div>
      <div className={styles.addTodoSection}>
        <input
          type="text"
          placeholder="Add a new task"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <button disabled={isCreating} onClick={handleAddTodo}>
          Add Todo
        </button>
      </div>
      {isLoading ? (
        <div className={styles.loader}></div>
      ) : (
        filteredTodos.map(({ id, title }) => (
          <div key={id} className={styles.todos}>
            {editingTodoId === id ? (
              <div>
                <input
                  type="text"
                  value={editedTodoTitle}
                  onChange={(e) => setEditedTodoTitle(e.target.value)}
                />
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateTodo(id, editedTodoTitle)}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                {title}
                <button onClick={() => handleEditTodo(id)}>Edit</button>
                <button
                  disabled={isDeleting}
                  onClick={() => handleDeleteTodo(id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
