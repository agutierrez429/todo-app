function TaskItem({
  task,
  index,
  editIndex,
  editText,
  setEditText,
  toggleComplete,
  startEdit,
  saveEdit,
  deleteTask
}) {
  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      {editIndex === index ? (
        <>
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
          <span className="task-text" onClick={() => toggleComplete(index)}>{task.text}</span>
          <div className="task-actions">
            <button className="task-btn" onClick={() => startEdit(index)}>Edit</button>
            <button className="task-btn delete-btn" onClick={(e) => {
              e.stopPropagation();
              deleteTask(index);
            }}>
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TaskItem;