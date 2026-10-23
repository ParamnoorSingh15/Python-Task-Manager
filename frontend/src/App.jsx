
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import "./App.css";

// Empty string = same origin. Works in Docker (FastAPI serves everything on :8000)
// and in local dev when Vite proxies /tasks -> http://127.0.0.1:8000 (see vite.config.js)
const API = "";

const emptyForm = {
  title: "",
  description: "",
  completed: false,
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    try {
      const response = await fetch(`${API}/tasks`);
      if (!response.ok) throw new Error("Could not load tasks");
      setTasks(await response.json());
      setError("");
    } catch {
      setError("Cannot connect to the backend. Start FastAPI on port 8000.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function saveTask(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    try {
      const response = await fetch(
        editingId ? `${API}/tasks/${editingId}` : `${API}/tasks`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            title: form.title.trim(),
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Could not save task");
      }

      setForm(emptyForm);
      setEditingId(null);
      setError("");
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  function editTask(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description || "",
      completed: task.completed,
    });
  }

  async function deleteTask(id) {
    if (!window.confirm("Delete this task?")) return;

    try {
      const response = await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Could not delete task");

      setError("");
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${API}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description || "",
          completed: !task.completed,
        }),
      });

      if (!response.ok) throw new Error("Could not update task");

      setError("");
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <p className="eyebrow">STAY ORGANIZED</p>
          <h1>Task Manager</h1>
          <p className="subtitle">Keep track of what matters.</p>
        </div>
        <span className="count">{tasks.length} tasks</span>
      </header>

      <section className="panel">
        <h2>{editingId ? "Edit task" : "Add a task"}</h2>

        <form onSubmit={saveTask} className="task-form">
          <input
            placeholder="What needs to be done?"
            value={form.title}
            maxLength={100}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            placeholder="Description (optional)"
            value={form.description}
            maxLength={500}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="form-actions">
            <button className="primary" type="submit">
              <Plus size={17} />
              {editingId ? "Save changes" : "Add task"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                  setError("");
                }}
              >
                <X size={17} /> Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="task-section">
        <div className="section-heading">
          <h2>Your tasks</h2>
          <span>{tasks.filter((task) => !task.completed).length} pending</span>
        </div>

        {loading ? (
          <p className="empty">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add your first task above.</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <article className="task" key={task.id}>
                <button
                  className={`check ${task.completed ? "checked" : ""}`}
                  title="Toggle completion"
                  onClick={() => toggleTask(task)}
                >
                  {task.completed && <Check size={16} />}
                </button>

                <div className="task-content">
                  <h3 className={task.completed ? "done" : ""}>
                    {task.title}
                  </h3>
                  {task.description && <p>{task.description}</p>}
                  <span className={`status ${task.completed ? "complete" : ""}`}>
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>

                <div className="task-actions">
                  <button title="Edit task" onClick={() => editTask(task)}>
                    <Pencil size={17} />
                  </button>
                  <button
                    title="Delete task"
                    className="delete"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
