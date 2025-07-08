import React from 'react';

const TaskList = ({ tasks, onDelete, onToggleComplete, onEdit }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <div
          key={task.id}
          className={`bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transition-all duration-200 hover:border-gray-600/50 hover:bg-gray-900/70 ${
            task.completed ? 'opacity-60' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="mt-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleComplete(task.id)}
                  className="w-5 h-5 text-gray-600 bg-gray-800 border-gray-600 rounded focus:ring-gray-500 focus:ring-2"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className={`text-lg font-medium ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-200'
                  }`}>
                    {task.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    <span className="mr-1">{getPriorityIcon(task.priority)}</span>
                    {task.priority.toUpperCase()}
                  </span>
                </div>
                
                {task.description && (
                  <p className={`text-sm mb-3 ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-400'
                  }`}>
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-4 text-xs">
                  {task.dueDate && (
                    <span className={`flex items-center space-x-1 ${
                      task.completed ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Due {formatDate(task.dueDate)}</span>
                    </span>
                  )}
                  
                  <span className={`flex items-center space-x-1 ${
                    task.completed ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Created {formatDate(task.createdAt)}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition duration-200"
                title="Edit task"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition duration-200"
                title="Delete task"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
