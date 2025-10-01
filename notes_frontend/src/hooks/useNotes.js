import { useCallback, useEffect, useMemo, useState } from 'react';
import { createNote, deleteNote, listNotes, toggleFavorite, updateNote } from '../services/notesService';

/**
 * PUBLIC_INTERFACE
 * useNotes: Manages notes list, selection, filters, and CRUD for the current user.
 */
export function useNotes(userId){
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('updated_at_desc');
  const [filter, setFilter] = useState('all');
  const [tag, setTag] = useState(null);

  const refresh = useCallback(async()=>{
    if (!userId) return;
    setLoading(true);
    try{
      const favoritesFirst = filter === 'starred';
      const data = await listNotes({ userId, search, tag, folder: null, sort, favoritesFirst });
      setNotes(data || []);
      if (data && data.length && !selectedId) setSelectedId(data[0].id);
    }catch(e){ setError(e.message || String(e)); }
    finally{ setLoading(false); }
  }, [userId, search, tag, sort, filter, selectedId]);

  useEffect(()=>{ refresh(); }, [refresh]);

  const selected = useMemo(()=> notes.find(n => n.id === selectedId) || null, [notes, selectedId]);

  const createNew = useCallback(async()=>{
    const n = await createNote({ userId, title:'', content:'', tags:[], folder:null });
    setNotes(prev => [n, ...prev]);
    setSelectedId(n.id);
  }, [userId]);

  const updateSelected = useCallback(async(patch)=>{
    if (!selected) return;
    const id = selected.id;
    setNotes(prev => prev.map(n => n.id===id? { ...n, ...patch, updated_at: new Date().toISOString() }: n));
    try{ await updateNote(id, patch); }catch(e){ /* could show toast */ }
  }, [selected]);

  const remove = useCallback(async(id)=>{
    const prev = notes;
    setNotes(prev.filter(n => n.id!==id));
    try{ await deleteNote(id); if (selectedId===id) setSelectedId(null); }catch(e){ setNotes(prev); }
  }, [notes, selectedId]);

  const toggleFav = useCallback(async(id, value)=>{
    setNotes(prev => prev.map(n => n.id===id? { ...n, is_favorite:value }: n));
    try{ await toggleFavorite(id, value); }catch(e){ /* ignore revert for simplicity */ }
  }, []);

  const tags = useMemo(()=>{
    const set = new Set();
    notes.forEach(n => (n.tags||[]).forEach(t => set.add(t)));
    return Array.from(set);
  }, [notes]);

  return { notes, selected, selectedId, setSelectedId, loading, error, search, setSearch, sort, setSort, filter, setFilter, tag, setTag, createNew, updateSelected, remove, toggleFav, refresh, tags };
}
