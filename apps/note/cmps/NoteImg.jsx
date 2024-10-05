export function NoteImg({ note, onRemoveNote }) {
  return (
    <section className='note-img-container'>
      <div className='note-img-card'>
        <h3 className='note-img-title'>{note.info.title}</h3>
        <img className='note-img-url' src={`${note.url}`} alt='' />
      </div>
    </section>
  )
}
