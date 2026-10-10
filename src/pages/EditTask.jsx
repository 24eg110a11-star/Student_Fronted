import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { taskApi, errorMessage } from '../services/api.js';
import TaskForm from '../components/TaskForm.jsx';
import Loading from '../components/Loading.jsx';
import Alert from '../components/Alert.jsx';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    taskApi.get(id).then((r) => setTask(r.data))
      .catch((e) => setError(e.response?.status === 404 ? 'Task not found.' : errorMessage(e)));
  }, [id]);

  const submit = async (form) => {
    setSaving(true); setError('');
    try {
      await taskApi.update(id, form);
      navigate(`/tasks/${id}`);
    } catch (e) { setError(errorMessage(e)); }
    finally { setSaving(false); }
  };

  if (!task && !error) return <Loading />;
  return (
    <>
      <h1>Edit Task</h1>
      <Alert>{error}</Alert>
      {task && <TaskForm initial={task} submitLabel="Update Task" onSubmit={submit}
        onCancel={() => navigate('/tasks')} saving={saving} />}
    </>
  );
}
