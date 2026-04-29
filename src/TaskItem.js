import { useEffect, useRef, useState } from "react";

function TaskItem({
  task,
  taskId,
  editTaskId,
  editText,
  setEditText,
  toggleComplete,
  startEdit,
  saveEdit,
  deleteTask
}) {
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const celebrationTimer = useRef(null);
  const deleteTimer = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(celebrationTimer.current);
      clearTimeout(deleteTimer.current);
    };
  }, []);

  const handleToggle = () => {
    if (isRemoving) {
      return;
    }

    if (!task.completed) {
      setIsCelebrating(true);
      clearTimeout(celebrationTimer.current);
      celebrationTimer.current = setTimeout(() => {
        setIsCelebrating(false);
      }, 650);
    }

    toggleComplete(taskId);
  };

  const handleDelete = (event) => {
    event.stopPropagation();

    if (isRemoving) {
      return;
    }

    setIsRemoving(true);
    deleteTimer.current = setTimeout(() => {
      deleteTask(taskId);
    }, 620);
  };

  const itemClassName = [
    "task-item",
    task.completed ? "completed" : "",
    editTaskId === taskId ? "editing" : "",
    isCelebrating ? "celebrating" : "",
    isRemoving ? "removing" : ""
  ].filter(Boolean).join(" ");

  return (
    <li className={itemClassName}>
      {editTaskId === taskId ? (
        <>
          <span className="task-edit-spacer" aria-hidden="true"></span>
          <input
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div className="task-actions">
            <button className="task-btn save-btn" onClick={saveEdit}>Save</button>
          </div>
        </>
      ) : (
        <>
          <label className="task-checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggle}
              aria-label={`Mark "${task.text}" as ${task.completed ? "active" : "complete"}`}
            />
            <span className="checkmark"></span>
          </label>
          <span className="task-text" onClick={handleToggle}>{task.text}</span>
          <div className="task-actions">
            <button className="task-btn" onClick={() => startEdit(taskId)}>Edit</button>
            <button className="task-btn delete-btn" onClick={handleDelete} disabled={isRemoving}>
              {isRemoving ? "Poof!" : "Delete"}
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TaskItem;
