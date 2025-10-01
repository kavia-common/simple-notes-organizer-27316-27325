import { supabase } from '../lib/supabaseClient';

const table = 'notes';

/**
 * PUBLIC_INTERFACE
 * listNotes: fetch notes for a user with search and sorting
 */
export async function listNotes({ userId, search = '', tag = null, folder = null, sort = 'updated_at_desc', favoritesFirst = false }){
  let q = supabase.from(table).select('*').eq('user_id', userId);
  if (search) q = q.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  if (tag) q = q.contains('tags', [tag]);
  if (folder) q = q.eq('folder', folder);
  if (favoritesFirst) q = q.order('is_favorite', { ascending: false });
  if (sort === 'updated_at_desc') q = q.order('updated_at', { ascending: false });
  if (sort === 'title_asc') q = q.order('title', { ascending: true });
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

/**
 * PUBLIC_INTERFACE
 * getNote: fetch a single note by id (scoped by RLS)
 */
export async function getNote(id){
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

/**
 * PUBLIC_INTERFACE
 * createNote: create a note for the user
 */
export async function createNote({ userId, title = '', content = '', tags = [], folder = null }){
  const { data, error } = await supabase.from(table).insert([{ user_id: userId, title, content, tags, folder }]).select().single();
  if (error) throw error; return data;
}

/**
 * PUBLIC_INTERFACE
 * updateNote: patch a note by id
 */
export async function updateNote(id, patch){
  const { data, error } = await supabase.from(table).update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error; return data;
}

/**
 * PUBLIC_INTERFACE
 * deleteNote: remove note by id
 */
export async function deleteNote(id){
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

/**
 * PUBLIC_INTERFACE
 * toggleFavorite: toggle star
 */
export async function toggleFavorite(id, value){
  return updateNote(id, { is_favorite: !!value });
}
