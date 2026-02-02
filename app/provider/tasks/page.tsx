'use client';

// ============================================================
// PROVIDER TASKS - Clinical Follow-ups & Reminders
// Track and manage patient follow-ups
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Task {
  id: string;
  client_id?: string;
  client_name?: string;
  appointment_id?: string;
  type: string;
  title: string;
  description?: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: string;
  completed_at?: string;
}

export default function ProviderTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'overdue' | 'completed'>('all');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'follow_up',
    due_date: new Date().toISOString().split('T')[0],
    priority: 'medium' as 'low' | 'medium' | 'high',
    client_id: '',
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/tasks?';
      if (filter === 'today') url += 'dueToday=true';
      else if (filter === 'overdue') url += 'overdue=true';
      else if (filter === 'completed') url += 'status=completed';
      
      const res = await fetch(url);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Demo tasks
      setTasks([
        {
          id: '1',
          client_name: 'Jane Smith',
          type: 'follow_up',
          title: 'Check filler results - 2 week follow up',
          due_date: new Date().toISOString().split('T')[0],
          priority: 'high',
          status: 'pending',
        },
        {
          id: '2',
          client_name: 'Mary Johnson',
          type: 'call_patient',
          title: 'Call re: touch-up eligibility',
          due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          priority: 'medium',
          status: 'pending',
        },
        {
          id: '3',
          type: 'chart_review',
          title: 'Complete chart notes for today\'s patients',
          due_date: new Date().toISOString().split('T')[0],
          priority: 'high',
          status: 'pending',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCompleteTask = async (taskId: string) => {
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: 'completed' }),
      });
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'completed', completed_at: new Date().toISOString() } : t
      ));
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title) return;
    
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const data = await res.json();
      if (data.task) {
        setTasks(prev => [data.task, ...prev]);
      }
      setShowNewTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        type: 'follow_up',
        due_date: new Date().toISOString().split('T')[0],
        priority: 'medium',
        client_id: '',
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateStr: string) => {
    return dateStr < new Date().toISOString().split('T')[0];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'follow_up': return '📅';
      case 'call_patient': return '📞';
      case 'chart_review': return '📝';
      case 'reminder': return '⏰';
      default: return '✓';
    }
  };

  // Stats
  const todayCount = tasks.filter(t => 
    t.due_date === new Date().toISOString().split('T')[0] && t.status !== 'completed'
  ).length;
  const overdueCount = tasks.filter(t => 
    isOverdue(t.due_date) && t.status !== 'completed'
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks & Follow-ups</h1>
          <p className="text-gray-500">Manage clinical reminders and patient follow-ups</p>
        </div>
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium"
        >
          + New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`bg-white rounded-xl border p-5 ${todayCount > 0 ? 'border-blue-200 bg-blue-50' : 'border-gray-100'}`}>
          <p className="text-sm text-gray-500">Due Today</p>
          <p className={`text-3xl font-bold ${todayCount > 0 ? 'text-blue-600' : 'text-gray-900'}`}>
            {todayCount}
          </p>
        </div>
        <div className={`bg-white rounded-xl border p-5 ${overdueCount > 0 ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
          <p className="text-sm text-gray-500">Overdue</p>
          <p className={`text-3xl font-bold ${overdueCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {overdueCount}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Completed This Week</p>
          <p className="text-3xl font-bold text-green-600">
            {tasks.filter(t => t.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'today', label: 'Due Today' },
          { id: 'overdue', label: 'Overdue' },
          { id: 'completed', label: 'Completed' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {tasks.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-5xl block mb-3">✅</span>
            <p className="text-gray-500 text-lg">No tasks to show</p>
            <p className="text-gray-400 text-sm mt-1">
              {filter === 'completed' ? 'No completed tasks' : 'All caught up!'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className={`p-4 ${
                  task.status === 'completed' ? 'bg-gray-50 opacity-75' :
                  isOverdue(task.due_date) ? 'bg-red-50' :
                  task.due_date === new Date().toISOString().split('T')[0] ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => task.status !== 'completed' && handleCompleteTask(task.id)}
                    disabled={task.status === 'completed'}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      task.status === 'completed'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-pink-500'
                    }`}
                  >
                    {task.status === 'completed' && '✓'}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getTypeIcon(task.type)}</span>
                      <p className={`font-medium ${
                        task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </p>
                    </div>
                    
                    {task.client_name && (
                      <p className="text-sm text-gray-600">
                        Patient: {task.client_name}
                      </p>
                    )}
                    
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    )}
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`text-sm font-medium ${
                      isOverdue(task.due_date) && task.status !== 'completed'
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}>
                      {formatDate(task.due_date)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">New Task</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                <select
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="follow_up">📅 Follow-up</option>
                  <option value="call_patient">📞 Call Patient</option>
                  <option value="chart_review">📝 Chart Review</option>
                  <option value="reminder">⏰ Reminder</option>
                  <option value="other">✓ Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g., 2-week filler follow-up"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Additional details..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={!newTask.title}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
