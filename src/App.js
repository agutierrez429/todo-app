import React, {useState, useEffect} from "react";
import './App.css';
import TaskItem from "./TaskItem";

const createTaskId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const normalizeTasks = (tasks) =>
  tasks.map((task) => ({
    ...task,
    id: task.id || createTaskId()
  }));

function App() {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? normalizeTasks(JSON.parse(savedTasks)) : [];
  });
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState("");

  const addTask = () => {
    if (taskInput.trim() === "") 
      return;

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: createTaskId(), text: taskInput, completed: false }
    ]);
    setTaskInput("");
  }
  const deleteTask = (taskId) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));

    if (editTaskId === taskId) {
      setEditTaskId(null);
      setEditText("");
    }
  };
  const clearAllTasks = () => {
    setTasks([]);
    setEditTaskId(null);
    setEditText("");
  };
  const toggleComplete = (taskId) => {
    setTasks((currentTasks) => currentTasks.map((task) => {
      if(task.id === taskId){
        return {...task, completed: !task.completed};
      }
      return task;
    }));
  };
  const startEdit = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);

    if (!taskToEdit) {
      return;
    }

    setEditTaskId(taskId);
    setEditText(taskToEdit.text);
  };
  const saveEdit = () => {
    setTasks((currentTasks) => currentTasks.map((task) => {
      if(task.id === editTaskId){
        return {...task, text: editText};
      }
      return task;
    }));
    setEditTaskId(null);
    setEditText("");
  };
  const [filter, setFilter] = useState("all");
  const taskCounts = {
    all: tasks.length,
    active: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length
  };
  const filteredTasks = tasks.filter((task) => {
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
          <button className={filterButtonClass("all")} onClick={() => setFilter("all")}>
            <span>All</span>
            <span className="filter-count">{taskCounts.all}</span>
          </button>
          <button className={filterButtonClass("active")} onClick={() => setFilter("active")}>
            <span>Active</span>
            <span className="filter-count">{taskCounts.active}</span>
          </button>
          <button className={filterButtonClass("completed")} onClick={() => setFilter("completed")}>
            <span>Completed</span>
            <span className="filter-count">{taskCounts.completed}</span>
          </button>
        </div>

        <ul className="task-list">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              taskId={task.id}
              editTaskId={editTaskId}
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
