import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskManager.css';

const API_URL = 'http://localhost:3000';

function TaskManager({ token, isAdmin }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [file, setFile] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(
        `${API_URL}/tasks/add`,
        { title, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setDescription('');
      setStatus('pending');
      setIsFormVisible(false);
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    setIsLoading(true);
    try {
      await axios.put(
        `${API_URL}/tasks/update/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/tasks/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleUpload = async (e) => {
  //   e.preventDefault();
  //   if (!file) return;
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   setIsLoading(true);
  //   try {
  //     await axios.post(`${API_URL}/tasks/upload`, formData, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setFile(null);
  //     const fileInput = document.getElementById('file-upload');
  //     if (fileInput) fileInput.value = '';
  //     alert('File uploaded successfully');
  //   } catch (err) {
  //     console.error('Error uploading file:', err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/tasks/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tasks.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadLogs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/tasks/logs`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'logs.txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div className="task-manager-container">
      <div className="task-manager-header">
      <h1 style={{ textAlign: 'center', width: '100%' }}>Task Manager PRO</h1>
        <div className="task-actions">
          <button className="primary-button" onClick={() => setIsFormVisible(!isFormVisible)}>
            {isFormVisible ? 'Cancel' : '+ New Task'}
          </button>
          <button className="secondary-button" onClick={handleExport}>
            <i className="icon-download"></i> Export CSV
          </button>
          {isAdmin && (
            <button className="secondary-button" onClick={handleDownloadLogs}>
              <i className="icon-logs"></i> Download Logs
            </button>
          )}
        </div>
      </div>

      {isFormVisible && (
        <div className="task-form-container">
          <h2>Create New Task</h2>
          <form onSubmit={handleCreate} className="task-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                rows="3"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select 
                id="status"
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-button" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Task'}
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="task-filters">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {isLoading && !filteredTasks.length ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks found. Create a new task to get started!</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task._id} className={`task-card ${task.status}`}>
                <div className="task-content">
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">{task.description}</p>
                  <span className={`task-status ${task.status}`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
                <div className="task-actions">
                  <button 
                    onClick={() => handleUpdate(task._id, task.status)}
                    className="action-button toggle"
                    title={task.status === 'pending' ? 'Mark as Completed' : 'Mark as Pending'}
                  >
                    <i className={task.status === 'pending' ? 'icon-check' : 'icon-refresh'}></i>
                  </button>
                  <button 
                    onClick={() => handleDelete(task._id)}
                    className="action-button delete"
                    title="Delete Task"
                  >
                    <i className="icon-trash"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TaskManager;