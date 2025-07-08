import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700/30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-slate-200">
            {initialData ? 'Edit Task' : 'Create New Task'}
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-300 p-2 rounded-lg hover:bg-slate-700/30 transition duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Form */}
      <div className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Title */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition duration-200"
              placeholder="What needs to be done?"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition duration-200 resize-none"
              placeholder="Add more details about this task..."
            />
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Priority Level
              </label>
              <div className="relative">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-xl text-slate-200 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition duration-200 appearance-none cursor-pointer"
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-xl text-slate-200 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-slate-700/30">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 text-slate-400 hover:text-slate-300 hover:bg-slate-700/30 rounded-xl transition duration-200 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-xl transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50 flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98] order-1 sm:order-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{initialData ? 'Update Task' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
