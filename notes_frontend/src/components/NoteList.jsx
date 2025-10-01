import React from 'react';

/**
 * PUBLIC_INTERFACE
 * NoteList: Renders list of notes; supports selection, favorite toggle, and delete.
 */
export default function NoteList({ notes, selectedId, onSelect, onToggleFav, onDelete }){
  return (
    <div className="list">
      {notes.map(n => (
        <div key={n.id} className={`note-item ${selectedId===n.id?'active':''}`} onClick={()=>onSelect(n.id)}>
          <div>
            <div className="title">{n.title || 'Untitled'}</div>
            <div className="meta">{new Date(n.updated_at || n.created_at).toLocaleString()}</div>
          </div>
          <div style={{ display:'flex', gap:8 }} onClick={(e)=>e.stopPropagation()}>
            <button className="button" style={{ background:'#e5e7eb', color:'#111827' }} onClick={()=>onToggleFav(n.id, !n.is_favorite)}>{n.is_favorite?'★':'☆'}</button>
            <button className="button" style={{ background:'var(--error)' }} onClick={()=>onDelete(n.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
