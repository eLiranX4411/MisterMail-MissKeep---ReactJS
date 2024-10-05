import { NotePreview } from '../../../apps/note/cmps/NotePreview.jsx'

export function NoteList({ notes, onRemoveNote }) {
  return (
    <section className='notes-list'>
      {notes.map((note) => (
        <NotePreview note={note} key={note.id} onRemoveNote={onRemoveNote} />
      ))}
    </section>
  )
}
