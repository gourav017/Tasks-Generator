import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  ArrowLeft, Download, Copy, Edit2, Trash2, 
  Save, X, AlertTriangle, HelpCircle, Check,
  GripVertical
} from 'lucide-react';
import { specificationsAPI } from '../services/api';
import TaskItem from '../components/TaskItem';

const SpecView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSpec();
  }, [id]);

  const fetchSpec = async () => {
    try {
      const response = await specificationsAPI.getById(id);
      if (response.success) {
        setSpec(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskEdit = (task, type) => {
    setEditingTask({ ...task, type });
  };

  const handleTaskSave = async () => {
    if (!editingTask) return;

    const updatedSpec = { ...spec };
    const taskType = editingTask.type === 'user-story' ? 'userStories' : 'engineeringTasks';
    
    const taskIndex = updatedSpec[taskType].findIndex(t => t._id === editingTask._id);
    if (taskIndex !== -1) {
      updatedSpec[taskType][taskIndex] = editingTask;
    }

    try {
      await specificationsAPI.update(id, updatedSpec);
      setSpec(updatedSpec);
      setEditingTask(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTaskDelete = async (taskId, type) => {
    const updatedSpec = { ...spec };
    const taskType = type === 'user-story' ? 'userStories' : 'engineeringTasks';
    
    updatedSpec[taskType] = updatedSpec[taskType].filter(t => t._id !== taskId);

    try {
      await specificationsAPI.update(id, updatedSpec);
      setSpec(updatedSpec);
    } catch (err) {
      setError(err.message);
    }
  };

  const moveTask = async (dragIndex, hoverIndex, type) => {
    const taskType = type === 'user-story' ? 'userStories' : 'engineeringTasks';
    const tasks = [...spec[taskType]];
    const draggedTask = tasks[dragIndex];
    
    tasks.splice(dragIndex, 1);
    tasks.splice(hoverIndex, 0, draggedTask);
    
    tasks.forEach((task, index) => {
      task.order = index;
    });

    const updatedSpec = { ...spec, [taskType]: tasks };
    setSpec(updatedSpec);

    try {
      await specificationsAPI.reorderTasks(id, tasks, type);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExport = async () => {
    try {
      const response = await specificationsAPI.export(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${spec.featureName.replace(/[^a-z0-9]/gi, '_')}.md`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to export specification');
    }
  };

  const handleCopy = () => {
    const text = generatePlainText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePlainText = () => {
    let text = `${spec.featureName}\n${'='.repeat(spec.featureName.length)}\n\n`;
    text += `Goal: ${spec.goal}\n\n`;
    text += `Target Users: ${spec.targetUsers}\n\n`;
    
    if (spec.userStories?.length > 0) {
      text += `User Stories:\n`;
      spec.userStories.forEach((story, i) => {
        text += `${i + 1}. ${story.title}\n   ${story.description}\n   Priority: ${story.priority}\n\n`;
      });
    }
    
    if (spec.engineeringTasks?.length > 0) {
      text += `Engineering Tasks:\n`;
      spec.engineeringTasks.forEach((task, i) => {
        text += `${i + 1}. ${task.title}\n   ${task.description}\n   Priority: ${task.priority}\n\n`;
      });
    }

    return text;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !spec) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Error</h2>
          <p className="text-slate-600 mb-4">{error || 'Specification not found'}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="btn-secondary flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleExport}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Specification Header */}
          <div className="card mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold font-display text-slate-800 mb-2">
                  {spec.featureName}
                </h1>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>Created: {new Date(spec.createdAt).toLocaleDateString()}</span>
                  {spec.template && spec.template !== 'custom' && (
                    <span className="badge bg-blue-100 text-blue-700">
                      {spec.template}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Goal</h3>
                <p className="text-slate-600">{spec.goal}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Target Users</h3>
                <p className="text-slate-600">{spec.targetUsers}</p>
              </div>
              {spec.constraints && (
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">Constraints</h3>
                  <p className="text-slate-600">{spec.constraints}</p>
                </div>
              )}
            </div>
          </div>

          {/* User Stories */}
          {spec.userStories && spec.userStories.length > 0 && (
            <div className="card mb-8">
              <h2 className="text-2xl font-bold font-display text-slate-800 mb-6">
                User Stories
              </h2>
              <div className="space-y-3">
                {spec.userStories.map((story, index) => (
                  <TaskItem
                    key={story._id || index}
                    task={story}
                    index={index}
                    type="user-story"
                    moveTask={moveTask}
                    onEdit={handleTaskEdit}
                    onDelete={handleTaskDelete}
                    isEditing={editingTask?._id === story._id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Engineering Tasks */}
          {spec.engineeringTasks && spec.engineeringTasks.length > 0 && (
            <div className="card mb-8">
              <h2 className="text-2xl font-bold font-display text-slate-800 mb-6">
                Engineering Tasks
              </h2>
              <div className="space-y-3">
                {spec.engineeringTasks.map((task, index) => (
                  <TaskItem
                    key={task._id || index}
                    task={task}
                    index={index}
                    type="engineering-task"
                    moveTask={moveTask}
                    onEdit={handleTaskEdit}
                    onDelete={handleTaskDelete}
                    isEditing={editingTask?._id === task._id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Risks and Unknowns */}
          <div className="grid md:grid-cols-2 gap-8">
            {spec.risks && spec.risks.length > 0 && (
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                  <h2 className="text-xl font-bold font-display text-slate-800">
                    Risks
                  </h2>
                </div>
                <div className="space-y-3">
                  {spec.risks.map((risk, index) => (
                    <div key={index} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <span className={`badge ${
                          risk.severity === 'high' ? 'badge-high' : 
                          risk.severity === 'medium' ? 'badge-medium' : 
                          'badge-low'
                        }`}>
                          {risk.severity}
                        </span>
                        <p className="text-slate-700 flex-1">{risk.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {spec.unknowns && spec.unknowns.length > 0 && (
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-bold font-display text-slate-800">
                    Unknowns
                  </h2>
                </div>
                <div className="space-y-3">
                  {spec.unknowns.map((unknown, index) => (
                    <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-slate-700">{unknown.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {editingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-2xl w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">Edit Task</h3>
                <button
                  onClick={() => setEditingTask(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Title</label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    rows="4"
                    className="input-field resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Priority</label>
                    <select
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Estimated Hours</label>
                    <input
                      type="number"
                      value={editingTask.estimatedHours || ''}
                      onChange={(e) => setEditingTask({ ...editingTask, estimatedHours: Number(e.target.value) })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={handleTaskSave} className="btn-primary flex-1">
                    <Save className="w-4 h-4 inline mr-2" />
                    Save Changes
                  </button>
                  <button onClick={() => setEditingTask(null)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default SpecView;