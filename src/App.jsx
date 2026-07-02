import { useState } from 'react';
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';
import PostList from './components/PostList';

export default function App() {
  const [view, setView] = useState('list');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar setView={setView} />
      <main>
        {view === 'list' ? <PostList /> : <PostForm />}
      </main>
    </div>
  );
}
