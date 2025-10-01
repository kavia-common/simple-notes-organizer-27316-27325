import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TopBar: Displays search input, sort selection, new note button, and user menu.
 */
export default function TopBar({ search, setSearch, onNew, sort, setSort, userEmail, onSignOut }){
  return (
    <div className="topbar">
      <input className="input" placeholder="Search notes..." value={search} onChange={(e)=>setSearch(e.target.value)} />
      <select className="select" value={sort} onChange={(e)=>setSort(e.target.value)}>
        <option value="updated_at_desc">Recent</option>
        <option value="title_asc">Title A–Z</option>
      </select>
      <button className="button" onClick={onNew}>New Note</button>
      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
        <span className="meta">{userEmail}</span>
        <button className="button" style={{ background:'var(--secondary)' }} onClick={onSignOut}>Sign out</button>
      </div>
    </div>
  );
}
