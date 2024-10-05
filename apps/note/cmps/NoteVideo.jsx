export function NoteVideo({ note, onRemoveNote }) {
  return (
    <section className='note-video-container'>
      <div className='note-video-card'>
        <h3 className='note-video-title'>{note.info.title}</h3>
        <video className='note-video-url'></video>
      </div>
    </section>
  )
}
