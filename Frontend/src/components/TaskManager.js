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
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);

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
      resetForm();
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

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setIsFormVisible(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(
        `${API_URL}/tasks/update/${editingTask._id}`,
        { title, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      resetForm();
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setIsFormVisible(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    // Apply status filter
    if (filter !== 'all' && task.status !== filter) return false;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return task.title.toLowerCase().includes(query) || 
             task.description.toLowerCase().includes(query);
    }
    
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get priority color based on status
  const getPriorityColor = (status) => {
    switch(status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'pending': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <div className="task-manager-container">
      <div className="task-manager-header">
        <h1><span className="gradient-text">Task Manager PRO</span></h1>
        <div className="task-actions">
          <button className="primary-button" onClick={() => setIsFormVisible(!isFormVisible)}>
            {isFormVisible ? '✖ Cancel' : '✚ New Task'}
          </button>
          {isAdmin && (
            <button className="secondary-button glass-effect" onClick={handleDownloadLogs}>
              <i className="icon-logs"></i> Download Logs
            </button>
          )}
        </div>
      </div>

      {isFormVisible && (
        <div className="task-form-container glass-card">
          <h2>{editingTask ? '✏️ Edit Task' : '✨ Create New Task'}</h2>
          <form onSubmit={editingTask ? handleSaveEdit : handleCreate} className="task-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="modern-input"
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
                className="modern-input"
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
                className="status-select modern-input"
              >
                <option value="pending">⭕ Pending</option>
                <option value="in-progress">⏳ In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-button pulse-effect" disabled={isLoading}>
                {isLoading ? 'Saving...' : editingTask ? 'Update Task' : 'Save Task'}
              </button>
              {editingTask && (
                <button 
                  type="button" 
                  className="secondary-button" 
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="task-filters-container glass-effect">
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
            className={`filter-button ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input modern-input"
          />
        </div>
      </div>

      {isLoading && !filteredTasks.length ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state glass-card">
              <div className="empty-icon">📝</div>
              <p>No tasks found. Create a new task to get started!</p>
              <button 
                className="primary-button"
                onClick={() => setIsFormVisible(true)}
              >
                Create First Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task._id} className={`task-card glass-card ${task.status}`}>
                <div className="priority-indicator" style={{ backgroundColor: getPriorityColor(task.status) }}></div>
                <div className="task-content">
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">{task.description}</p>
                  <div className="task-metadata">
                    <span className={`task-status ${task.status}`}>
                      {task.status === 'pending' && '⭕'}
                      {task.status === 'in-progress' && '⏳'}
                      {task.status === 'completed' && '✅'}
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                    {task.createdAt && 
                      <span className="task-date">📅 {formatDate(task.createdAt)}</span>
                    }
                  </div>
                </div>
                <div className="task-actions">
                  <button 
                    onClick={() => handleEditTask(task)}
                    className="action-button edit"
                    title="Edit Task"
                  >
                    <i className="icon-edit">✏️</i>
                  </button>
                  <button 
                    onClick={() => handleUpdate(task._id, task.status)}
                    className="action-button toggle"
                    title={task.status === 'pending' ? 'Mark as Completed' : 'Mark as Pending'}
                  >
                    <i className={task.status === 'pending' ? 'icon-check' : 'icon-refresh'}>
                      {task.status === 'pending' ? '✓' : '↺'}
                    </i>
                  </button>
                  <button 
                    onClick={() => handleDelete(task._id)}
                    className="action-button delete"
                    title="Delete Task"
                  >
                    <i className="icon-trash">🗑️</i>
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