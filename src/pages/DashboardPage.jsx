import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  FileText,
  Pin,
  FolderOpen,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Clock,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import NoteGrid from '../components/notes/NoteGrid.jsx';
import subjectService from '../services/subjectService.js';
import noteService from '../services/noteService.js';
import Button from '../components/common/Button.jsx';
import { SkeletonGrid } from '../components/common/Loader.jsx';

export function DashboardPage() {
  const { user } = useAuth();
  const {
    refreshTrigger,
    onOpenCreateModal,
    onEditNote,
    onPinToggle,
    onDeleteNote,
    showToast,
    triggerRefresh,
  } = useOutletContext();

  const [stats, setStats] = useState(null);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [statsRes, pinnedRes] = await Promise.all([
          subjectService.getDashboardStats(),
          noteService.getNotes({ isPinned: true, limit: 6 }),
        ]);

        if (statsRes.success) {
          setStats(statsRes.data);
          setRecentNotes(statsRes.data.recentNotes || []);
        }

        if (pinnedRes.success) {
          setPinnedNotes(pinnedRes.data || []);
        }
      } catch (err) {
        console.warn('Dashboard fetch issue:', err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [refreshTrigger]);

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const res = await subjectService.seedDemoData();
      showToast(res.message || 'Sample notes created!');
      triggerRefresh();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to seed sample notes', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    {
      title: 'Total Notes',
      value: stats?.totalNotes ?? 0,
      icon: FileText,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/60',
      link: '/app/notes',
    },
    {
      title: 'Pinned Notes',
      value: stats?.pinnedNotes ?? 0,
      icon: Pin,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      link: '/app/pinned',
    },
    {
      title: 'Active Subjects',
      value: stats?.totalSubjects ?? 0,
      icon: FolderOpen,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      link: '/app/subjects',
    },
    {
      title: 'Total Words Written',
      value: (stats?.totalWords ?? 0).toLocaleString(),
      icon: Sparkles,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/60',
      link: '/app/notes',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-700 text-white shadow-card">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>StudySpace Academic Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Scholar'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 max-w-lg">
            Organize thoughts, manage lectures, and track your revision material seamlessly in one cohesive workspace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {stats?.totalNotes === 0 && (
            <Button
              variant="secondary"
              size="md"
              onClick={handleSeedData}
              isLoading={seeding}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              Load Sample Notes
            </Button>
          )}
          <Button
            variant="secondary"
            size="md"
            onClick={onOpenCreateModal}
            icon={Plus}
            className="bg-white text-slate-900 hover:bg-slate-100 shadow-subtle border-0"
          >
            Create Note
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.link}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card-hover hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-150 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {loading ? '...' : stat.value}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Pinned Notes
              </h2>
            </div>
            <Link
              to="/app/pinned"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View all pinned</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <NoteGrid
            notes={pinnedNotes}
            loading={loading}
            onEdit={onEditNote}
            onPinToggle={onPinToggle}
            onDelete={onDeleteNote}
          />
        </div>
      )}

      {/* Recent Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Recently Updated Notes
            </h2>
          </div>
          <Link
            to="/app/notes"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>View all notes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <NoteGrid
          notes={recentNotes}
          loading={loading}
          onEdit={onEditNote}
          onPinToggle={onPinToggle}
          onDelete={onDeleteNote}
          emptyTitle="Your workspace is empty"
          emptyDescription="Create your first note or load sample study materials to get started."
          onEmptyAction={onOpenCreateModal}
          emptyActionLabel="Create First Note"
        />
      </div>
    </div>
  );
}

export default DashboardPage;
