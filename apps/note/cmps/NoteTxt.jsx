export function NoteTxt({ note, onRemoveNote }) {
  //   console.log('note:', note)

  return (
    <section className='note-txt-container'>
      <div className='note-txt-card'>
        <h5 className='note-txt-text'>{note.info.txt}</h5>
      </div>
    </section>
  )
}
