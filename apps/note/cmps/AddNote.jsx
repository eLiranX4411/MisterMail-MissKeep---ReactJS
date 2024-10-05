import { noteService } from '../../../apps/note/services/note.service.js'

const { useState, useEffect, useRef } = React

export function AddNote() {
  const [noteData, setNoteData] = useState(noteService.getEmptyNote())
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className='add-note'>
      <div className='add-note-container'>
        {isExpanded ? (
          <React.Fragments>
            <input type='text' name='title' placeholder='Title' value={noteData.title} />
            <textarea name='text' placeholder='Take a note...' value={noteData.text} />

            <input type='file' accept='image/*' />
            <button>Add Note</button>
          </React.Fragments>
        ) : (
          <input type='text' placeholder='Take a note...' />
        )}
      </div>
    </section>
  )
}
