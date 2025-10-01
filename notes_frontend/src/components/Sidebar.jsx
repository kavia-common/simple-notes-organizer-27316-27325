import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Sidebar: Shows quick filters (All, Starred, Recent) and tag chips.
 */
export default function Sidebar({ filter, setFilter, tags = [], setTag }){
  return (
    <aside className="sidebar">
      <h3>Notes</h3>
      <div className="card" style={{ padding:12, display:'grid', gap:6 }}>
        <button className="button" style={{ background: filter==='all'?'var(--primary)':'#e5e7eb', color: filter==='all'?'#fff':'#111827' }} onClick={()=>setFilter('all')}>All</button>
        <button className="button" style={{ background: filter==='starred'?'var(--primary)':'#e5e7eb', color: filter==='starred'?'#fff':'#111827' }} onClick={()=>setFilter('starred')}>Starred</button>
        <button className="button" style={{ background: filter==='recent'?'var(--primary)':'#e5e7eb', color: filter==='recent'?'#fff':'#111827' }} onClick={()=>setFilter('recent')}>Recent</button>
      </div>
      <h3>Tags</h3>
      <div className="card" style={{ padding:12, display:'flex', flexWrap:'wrap', gap:8 }}>
        {tags.length === 0 ? <span className="meta">No tags yet</span> : tags.map(t => (
          <button key={t} className="button" style={{ background:'#e5e7eb', color:'#111827' }} onClick={()=>setTag(t)}>{t}</button>
        ))}
      </div>
    </aside>
  );
}
