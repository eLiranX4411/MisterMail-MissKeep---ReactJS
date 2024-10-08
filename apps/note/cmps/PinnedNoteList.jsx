import { NotePreview } from '../../../apps/note/cmps/NotePreview.jsx'

export function PinnedNoteList({ notes, onRemoveNote, onSetNewColor, onPinnedNote }) {
  return (
    <section className='notes-list'>
      {notes.map((note) => (
        <NotePreview
          note={note}
          key={note.id}
          onRemoveNote={onRemoveNote}
          onPinnedNote={onPinnedNote}
          onSetNewColor={onSetNewColor}
        />
      ))}
    </section>
  )
}
