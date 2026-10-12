import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-light dark:bg-surface-dark text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="text-center max-w-md space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-subtle">
          <BookOpen className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-brand-600 dark:text-brand-400">
            404
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The page or note you are looking for doesn't exist or may have been relocated.
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <Link to="/app">
            <Button variant="primary" size="md" icon={Home}>
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
