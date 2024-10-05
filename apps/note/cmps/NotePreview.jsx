export function NotePreview({ notes, onRemoveNote }) {
  return (
    <section className='note-preview'>
      <h3>{notes.info.title}</h3>
    </section>
  )
}
