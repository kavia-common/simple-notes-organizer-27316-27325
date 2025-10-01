import React, { useEffect, useMemo, useState } from 'react';
import { debounce } from '../utils/debounce';

/**
 * PUBLIC_INTERFACE
 * NoteEditor: Displays title and content fields and autosaves changes (debounced).
 */
export default function NoteEditor({ note, onChange }){
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(()=>{ setTitle(note?.title || ''); setContent(note?.content || ''); }, [note?.id]);

  const debouncedCommit = useMemo(()=> debounce((patch)=> onChange(patch), 700), [onChange]);

  useEffect(()=>{ if (note) debouncedCommit({ title }); }, [title]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(()=>{ if (note) debouncedCommit({ content }); }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!note) return <div className="empty card">Select or create a note to start writing.</div>;

  return (
    <div className="editor">
      <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="textarea" rows={18} placeholder="Start writing..." value={content} onChange={e=>setContent(e.target.value)} />
      <div className="meta">Auto-saved • {new Date(note.updated_at || note.created_at).toLocaleString()}</div>
    </div>
  );
}
