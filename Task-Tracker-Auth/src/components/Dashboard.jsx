import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/tasks?userId=${user.id}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = {
        ...taskData,
        userId: user.id,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        completed: false
      };

      const response = await axios.post('http://localhost:3001/tasks', newTask);
      setTasks([...tasks, response.data]);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await axios.put(`http://localhost:3001/tasks/${editingTask.id}`, {
        ...editingTask,
        ...taskData
      });
      setTasks(tasks.map(task => task.id === editingTask.id ? response.data : task));
      setEditingTask(null);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const response = await axios.put(`http://localhost:3001/tasks/${taskId}`, {
        ...task,
        completed: !task.completed
      });
      setTasks(tasks.map(t => t.id === taskId ? response.data : t));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowTaskForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-slate-400"></div>
          <p className="text-slate-400 text-sm">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-200">
                Your Tasks
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                <p className="text-slate-400 text-sm">
                  {tasks.length === 0 
                    ? 'No tasks yet' 
                    : `${tasks.filter(t => !t.completed).length} active`
                  }
                  {tasks.length > 0 && tasks.filter(t => t.completed).length > 0 && (
                    <span className="text-slate-500"> • {tasks.filter(t => t.completed).length} completed</span>
                  )}
                </p>
                {tasks.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-full sm:w-48 bg-slate-700/30 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-slate-600 to-slate-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-slate-500 text-xs whitespace-nowrap">
                      {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 sm:px-6 py-3 rounded-xl transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50 transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">New Task</span>
            </button>
          </div>
        </div>

        {/* Task Form */}
        {showTaskForm && (
          <div className="mb-8">
            <TaskForm
              onSubmit={editingTask ? handleUpdateTask : handleAddTask}
              onCancel={handleCancelEdit}
              initialData={editingTask}
            />
          </div>
        )}

        {/* Task List or Empty State */}
        {tasks.length === 0 && !showTaskForm ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="mx-auto w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-light text-slate-300 mb-3">No tasks yet</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto px-4">
              Create your first task to get started with organizing your work and boosting productivity.
            </p>
            <button
              onClick={() => setShowTaskForm(true)}
              className="inline-flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-xl transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Create Your First Task</span>
            </button>
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            <TaskList
              tasks={tasks}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
