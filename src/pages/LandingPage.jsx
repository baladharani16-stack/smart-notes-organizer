import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FolderOpen,
  Search,
  Pin,
  Clock,
  Database,
  Terminal,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-slate-800 dark:text-slate-100 selection:bg-brand-500 selection:text-white transition-colors duration-200">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-subtle group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              StudySpace
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-subtle transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-subtle transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200/80 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for Students, Engineers & Lifelong Learners</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Your Notes. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-violet-600">
              Your Subjects.
            </span>{' '}
            Your Space.
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Organize lecture notes, system designs, coding summaries, and revision lists with custom subjects, lightning-fast search, and soft-delete trash protection.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? '/app' : '/register'}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-semibold text-sm sm:text-base shadow-card hover:shadow-card-hover transition-all"
            >
              <span>{isAuthenticated ? 'Open Your Space' : 'Get Started for Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-semibold text-sm sm:text-base transition-colors"
            >
              Sign In to Account
            </Link>
          </div>

          {/* Dribbble-inspired UI Preview Container */}
          <div className="mt-14 sm:mt-16 max-w-5xl mx-auto rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-brand-100/60 to-transparent dark:from-brand-950/40 border border-slate-200/80 dark:border-slate-800/80 shadow-elevated">
            <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 text-left">
              {/* Fake Mockup Header */}
              <div className="h-12 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs font-medium text-slate-400">StudySpace Dashboard Preview</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>MongoDB Atlas</span>
                  <span>•</span>
                  <span>Vercel Serverless</span>
                </div>
              </div>

              {/* Fake Content Cards */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/30 dark:bg-indigo-950/20">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Programming
                  </span>
                  <h4 className="text-sm font-semibold mt-1 text-slate-900 dark:text-white">
                    Mastering React 18 Concurrent Rendering
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    useTransition allows marking UI updates as non-urgent. useDeferredValue defers non-critical UI trees...
                  </p>
                  <div className="mt-3 flex gap-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100/80 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">#react</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100/80 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">#frontend</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-950 bg-emerald-50/30 dark:bg-emerald-950/20">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Database
                  </span>
                  <h4 className="text-sm font-semibold mt-1 text-slate-900 dark:text-white">
                    MongoDB Indexing & ESR Guideline
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    Equality, Sort, Range order for compound keys. Keep indexes lean and evaluate totalDocsExamined...
                  </p>
                  <div className="mt-3 flex gap-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">#mongodb</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">#nosql</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-sky-100 dark:border-sky-950 bg-sky-50/30 dark:bg-sky-950/20">
                  <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                    Cloud Computing
                  </span>
                  <h4 className="text-sm font-semibold mt-1 text-slate-900 dark:text-white">
                    Serverless Connection Caching
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    Persist connection instances on global.mongoose to handle Vercel invocation warm cycles efficiently...
                  </p>
                  <div className="mt-3 flex gap-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100/80 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300">#vercel</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100/80 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300">#serverless</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 sm:py-24 border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Engineered for seamless knowledge recall
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
              Every detail is tuned for focus, structure, and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-surface-light dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-600 dark:text-brand-400">
                <FolderOpen className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                Custom Subject Hierarchy
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Group notes by courses or disciplines like Programming, Cloud Computing, Database, or Interview Prep.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-light dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-600 dark:text-brand-400">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                Debounced Full-Text Search
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Filter across note titles, body contents, subjects, and tags instantly without annoying interface stutters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-light dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-600 dark:text-brand-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                Soft Delete & Trash Recovery
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Never fear accidental deletion. Notes sit safely in Trash until you explicitly restore or permanently purge them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} StudySpace — Smart Notes Organizer. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">React + Express + MongoDB + Tailwind</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
