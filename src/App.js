import React, {useState, useEffect} from "react";
import './App.css';
import TaskItem from "./TaskItem";

function App() {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const addTask = () => {
    if (taskInput.trim() === "") 
      return;

    setTasks([...tasks, {text: taskInput, completed: false}]);
    setTaskInput("");
  }
  const deleteTask = (taskIndex) => {
    const updatedTasks = tasks.filter((_, index) => index !== taskIndex);
    setTasks(updatedTasks);
  };
  const clearAllTasks = () => {
    setTasks([]);
  };
  const toggleComplete = (taskIndex) => {
    const updatedTasks = tasks.map((task, index) => {
      if(index === taskIndex){
        return {...task, completed: !task.completed};
      }
      return task;
    });
    setTasks(updatedTasks);
  };
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const startEdit = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].text);
  };
  const saveEdit = () => {
    const updatedTasks = tasks.map((task, index) => {
      if(index === editIndex){
        return {...task, text: editText};
      }
      return task;
    });
    setTasks(updatedTasks);
    setEditIndex(null);
    setEditText("");
  };
  const [filter, setFilter] = useState("all");
  const filteredTasks = tasks
    .map((task, index) => ({ task, originalIndex: index}))
    .filter(({ task }) => {
      if(filter === "active") return !task.completed;
      if(filter === "completed") return task.completed;
      return true;
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filterButtonClass = (value) =>
    `filter-btn ${filter === value ? "active" : ""}`;

  return (
    <div className="App">
      <div className="app-shell">
        <header className="app-header">
          <div>
            <h1>To-Do List</h1>
            <p>Track your priorities with a clean, modern task manager.</p>
          </div>
        </header>

        <div className="input-row">
          <input
            className="task-input"
            type="text"
            placeholder="Add a new task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
          />

          <button className="primary-btn" onClick={addTask}>
            Add Task
          </button>
          <button className="secondary-btn" onClick={clearAllTasks} disabled={tasks.length === 0}>
            Clear All
          </button>
        </div>

        <div className="filter-group">
          <button className={filterButtonClass("all")} onClick={() => setFilter("all")}>All</button>
          <button className={filterButtonClass("active")} onClick={() => setFilter("active")}>Active</button>
          <button className={filterButtonClass("completed")} onClick={() => setFilter("completed")}>Completed</button>
        </div>

        <ul className="task-list">
          {filteredTasks.map(({ task, originalIndex }) => (
            <TaskItem
              key={originalIndex}
              task={task}
              index={originalIndex}
              editIndex={editIndex}
              editText={editText}
              setEditText={setEditText}
              toggleComplete={toggleComplete}
              startEdit={startEdit}
              saveEdit={saveEdit}
              deleteTask={deleteTask}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
