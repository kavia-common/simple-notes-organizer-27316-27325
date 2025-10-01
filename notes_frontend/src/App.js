import React, { useState } from 'react';
import './index.css';
import './App.css';
import { useAuth } from './hooks/useAuth';
import { useNotes } from './hooks/useNotes';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';

// PUBLIC_INTERFACE
function SignIn(){
  /** Email OTP sign-in form using Supabase magic link */
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const onSubmit = async (e) => { e.preventDefault(); const err = await signInWithEmail(email); if (!err) setSent(true); };
  return (
    <div style={{ height:'100vh', display:'grid', placeItems:'center', background:'var(--bg)' }}>
      <div className="card" style={{ padding:20, width:360 }}>
        <h2>Sign in</h2>
        {sent ? <p>Check your email for a magic link.</p> : (
          <form onSubmit={onSubmit}>
            <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            <button className="button" type="submit" style={{ marginTop:10, width:'100%' }}>Send magic link</button>
          </form>
        )}
        <p className="meta" style={{ marginTop:8 }}>Powered by Supabase Auth</p>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App(){
  /** Root application. Shows sign-in when unauthenticated and main notes UI when authenticated. */
  const { user, loading, signOut } = useAuth();
  const notes = useNotes(user?.id);

  if (loading) return <div className="empty">Loading...</div>;
  if (!user) return <SignIn/>;

  return (
    <div className="app">
      <div className="hidden-sm"><Sidebar filter={notes.filter} setFilter={notes.setFilter} tags={notes.tags} setTag={notes.setTag} /></div>
      <div className="main">
        <TopBar search={notes.search} setSearch={notes.setSearch} onNew={notes.createNew} sort={notes.sort} setSort={notes.setSort} userEmail={user?.email} onSignOut={signOut} />
        <div className="content">
          <NoteList notes={notes.notes} selectedId={notes.selectedId} onSelect={notes.setSelectedId} onToggleFav={notes.toggleFav} onDelete={notes.remove} />
          {notes.selected ? <NoteEditor note={notes.selected} onChange={notes.updateSelected} /> : <EmptyState/>}
        </div>
      </div>
    </div>
  );
}
