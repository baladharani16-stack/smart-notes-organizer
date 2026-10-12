import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Settings,
  User,
  Moon,
  Sun,
  Shield,
  Database,
  Sparkles,
  LogOut,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import subjectService from '../services/subjectService.js';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import { formatFullDate } from '../utils/formatDate.js';

export function SettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { showToast, triggerRefresh } = useOutletContext();

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const payload = { name: name.trim() };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      await updateProfile(payload);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      showToast('Profile updated!');
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to update profile',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSeedDemoData = async () => {
    setSeeding(true);
    try {
      const res = await subjectService.seedDemoData();
      showToast(res.message || 'Sample notes created!');
      triggerRefresh();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to load sample data', 'error');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Workspace Settings
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile, appearance preferences, and study materials.
        </p>
      </div>

      {/* Profile & Security Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Profile & Account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Account created: {formatFullDate(user?.createdAt)}
            </p>
          </div>
        </div>

        {profileMsg && (
          <div
            className={`p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
              profileMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
            }`}
          >
            {profileMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm px-3.5 py-2.5 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Email cannot be changed</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Change Password (Leave blank to keep current)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={savingProfile}
            >
              Update Profile
            </Button>
          </div>
        </form>
      </div>

      {/* Appearance & Theme Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Appearance & Theme
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Currently using <span className="font-semibold capitalize">{theme}</span> mode.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            icon={isDark ? Sun : Moon}
          >
            Switch to {isDark ? 'Light' : 'Dark'}
          </Button>
        </div>
      </div>

      {/* Demo Data Generator & System Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Demo Study Notes Seeder
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Populate rich notes across React, MongoDB, System Design, and Vercel for instant portfolio demonstration.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSeedDemoData}
            isLoading={seeding}
            icon={Sparkles}
          >
            Load Sample Notes
          </Button>
        </div>
      </div>

      {/* Session Management Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Log Out of StudySpace
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Terminate your session and clear secure local authentication keys.
          </p>
        </div>
        <Button variant="dangerOutline" size="sm" onClick={logout} icon={LogOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default SettingsPage;
