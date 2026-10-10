import { useState } from 'react';

const empty = { title: '', subject: '', description: '', priority: 'MEDIUM', dueDate: '', status: 'PENDING' };

export default function TaskForm({ initial, submitLabel, onSubmit, onCancel, saving }) {
  const start = initial ? { ...empty, ...initial, dueDate: (initial.dueDate || '').slice(0, 10) } : empty;
  const [form, setForm] = useState(start);
  const [errors, setErrors] = useState({});

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (saving) return;
    const err = {};
    if (!form.title.trim()) err.title = 'Title is required';
    if (!form.subject.trim()) err.subject = 'Subject is required';
    if (!form.dueDate) err.dueDate = 'Due date is required';
    setErrors(err);
    if (Object.keys(err).length) return;
    onSubmit(form);
  };

  return (
    <form className="card form" onSubmit={submit} noValidate>
      <label>Task Title *
        <input name="title" value={form.title} onChange={change} maxLength={200} />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </label>
      <label>Subject *
        <input name="subject" value={form.subject} onChange={change} maxLength={100} />
        {errors.subject && <span className="field-error">{errors.subject}</span>}
      </label>
      <label>Description
        <textarea name="description" rows="4" value={form.description || ''} onChange={change} />
      </label>
      <div className="grid-3">
        <label>Priority
          <select name="priority" value={form.priority} onChange={change}>
            <option>LOW</option><option>MEDIUM</option><option>HIGH</option>
          </select>
        </label>
        <label>Due Date *
          <input type="date" name="dueDate" value={form.dueDate} onChange={change} />
          {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
        </label>
        <label>Status
          <select name="status" value={form.status} onChange={change}>
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </label>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : submitLabel}</button>
        <button className="btn btn-light" type="button" onClick={() => { setForm(start); setErrors({}); }}>Reset</button>
        <button className="btn btn-light" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
