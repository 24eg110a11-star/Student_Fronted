import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskApi, errorMessage } from '../services/api.js';
import TaskForm from '../components/TaskForm.jsx';
import Alert from '../components/Alert.jsx';

export default function AddTask() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (form) => {
    setSaving(true); setError('');
    try {
      await taskApi.create(form);
      navigate('/tasks');
    } catch (e) {
      setError(e.response?.status === 400 ? 'Please fill all required fields.' : errorMessage(e));
    } finally { setSaving(false); }
  };

  return (
    <>
      <h1>Add Task</h1>
      <Alert>{error}</Alert>
      <TaskForm submitLabel="Add Task" onSubmit={submit} onCancel={() => navigate('/tasks')} saving={saving} />
    </>
  );
}
