import { noteService } from '../../../apps/note/services/note.service.js'

const { useState, useEffect, useRef } = React

export function AddNote({ handleAddNote }) {
  const [noteData, setNoteData] = useState(noteService.getEmptyNote())
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    loadNote()
  }, [])

  function loadNote() {
    noteService
      .get(noteData)
      .then(setNoteData)
      .catch((err) => {
        console.log('Problem getting note', err)
      })
  }

  function handleExpand() {
    setIsExpanded(true)
  }

  function resetInputs() {
    setNoteData(noteService.getEmptyNote())
  }

  function handleChange({ target }) {
    const evName = target.name
    const evValue = target.value

    setNoteData((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, [evName]: evValue }
    }))
  }

  function onAddNote(ev) {
    ev.preventDefault()
    noteService
      .save(noteData)
      .then((newNote) => {
        handleAddNote(newNote)
        resetInputs()
      })
      .catch((err) => {
        console.log('Error adding note:', err)
      })
  }

  const { info } = noteData
  const { txt, title } = info

  return (
    <form onSubmit={onAddNote} className='add-note'>
      <div className={`add-note-container ${isExpanded ? 'expanded' : ''}`}>
        {isExpanded ? (
          <React.Fragment>
            <input type='text' name='title' placeholder='Title' value={title} onChange={handleChange} className='add-note-title' />
            <textarea name='txt' placeholder='Take a note...' value={txt} onChange={handleChange} className='add-note-text' />
            {/* <input type='file' accept='image/*' className='add-note-image' /> */}
            <button type='submit' className='add-note-btn'>
              Add Note
            </button>
          </React.Fragment>
        ) : (
          <input type='text' placeholder='Take a note...' className='add-note-placeholder' onClick={handleExpand} />
        )}
      </div>
    </form>
  )
}
