import { noteService } from '../../../apps/note/services/note.service.js'

const { useState, useEffect, useRef } = React

export function AddNote() {
  const [noteData, setNoteData] = useState(noteService.getEmptyNote())
  const [isExpanded, setIsExpanded] = useState(false)

  function handleChange({ target }) {
    const evName = target.name
    const evValue = target.value

    setNoteData((prevNote) => ({ ...prevNote, [evName]: evValue }))
  }

  function handleExpand() {
    setIsExpanded(true)
  }

  function handleAddNote() {
    console.log('Adding note:', noteData)
  }

  return (
    <section className='add-note'>
      <div className={`add-note-container ${isExpanded ? 'expanded' : ''}`}>
        {isExpanded ? (
          <React.Fragment>
            <input type='text' name='title' placeholder='Title' value={noteData.title} onChange={handleChange} className='add-note-title' />
            <textarea name='text' placeholder='Take a note...' value={noteData.text} onChange={handleChange} className='add-note-text' />
            <input type='file' accept='image/*' className='add-note-image' />
            <div className='add-note-btn-container'>
              <button className='add-note-btn' onClick={handleAddNote}>
                Add Note
              </button>
            </div>
          </React.Fragment>
        ) : (
          <input type='text' placeholder='Take a note...' className='add-note-placeholder' onClick={handleExpand} />
        )}
      </div>
    </section>
  )
}
