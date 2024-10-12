import { noteService } from '../../../apps/note/services/note.service.js'

const { useState, useEffect, useRef } = React

export function AddNote({ handleAddNote }) {
  const [noteData, setNoteData] = useState(noteService.getEmptyNote())
  const [isExpanded, setIsExpanded] = useState(false)
  const [imgPreview, setImgPreview] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)

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

  function onAddNote(ev) {
    ev.preventDefault()
    noteService
      .save(noteData)
      .then((newNote) => {
        handleAddNote(newNote)
        resetInputs()
        setIsExpanded(false)
        setImgPreview(null)
      })
      .catch((err) => {
        console.log('Error adding note:', err)
      })
  }

  function handleChange({ target }) {
    const evName = target.name
    const evValue = target.value

    setNoteData((prevNote) => ({
      ...prevNote,
      info: { ...prevNote.info, [evName]: evValue }
    }))
  }

  function handleTodoChange({ target }, idx) {
    const { value } = target

    setNoteData((prevNote) => {
      const updatedTodos = prevNote.info.todos.map((todo, todoIdx) => {
        if (todoIdx === idx) {
          return { ...todo, txt: value }
        }
        return todo
      })

      return {
        ...prevNote,
        info: { ...prevNote.info, todos: updatedTodos }
      }
    })
  }

  function handleFileChange(ev) {
    const file = ev.target.files[0]

    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImgPreview(reader.result)
        setNoteData((prevNote) => ({
          ...prevNote,
          info: { ...prevNote.info, url: reader.result }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  function handleVideoChange(ev) {
    const file = ev.target.files[0]
    if (file) {
      const reader = new FileReader()

      reader.onload = () => {
        setVideoPreview(reader.result)
        setNoteData((prevNote) => ({
          ...prevNote,
          info: { ...prevNote.info, url: reader.result }
        }))
      }

      reader.readAsDataURL(file)
    }
  }

  function setNoteType(type) {
    setNoteData((prevNote) => {
      switch (type) {
        case 'NoteTodos':
          return { ...prevNote, ...noteService.getEmptyTodosNote() }
        case 'NoteImg':
          return { ...prevNote, ...noteService.getEmptyImgNote() }
        case 'NoteVideo':
          return { ...prevNote, ...noteService.getEmptyVideoNote() }
        default:
          return { ...prevNote, ...noteService.getEmptyNote() }
      }
    })
  }

  function handleExpand() {
    setIsExpanded(true)
  }

  function handleExpandFalse() {
    setIsExpanded(false)
  }

  function resetInputs() {
    setNoteData(noteService.getEmptyNote())
  }

  const { info, type } = noteData
  const { txt, title, todos, url } = info

  return (
    <React.Fragment>
      <form onSubmit={onAddNote} className='add-note'>
        <div className={`add-note-container ${isExpanded ? 'expanded' : ''}`}>
          {isExpanded && type === 'NoteTxt' ? (
            <React.Fragment>
              <input type='text' name='title' placeholder='Title' value={title} onChange={handleChange} className='add-note-title' />
              <textarea name='txt' placeholder='Take a note...' value={txt} onChange={handleChange} className='add-note-text' />
              {/* <input type='file' accept='image/*' className='add-note-image' /> */}
              <button type='submit' className='add-note-btn'>
                Add Note
              </button>
              <button onClick={handleExpandFalse} type='button'>
                x
              </button>
            </React.Fragment>
          ) : (
            <input type='text' placeholder='Take a note...' className='add-note-placeholder' onClick={handleExpand} />
          )}

          {isExpanded && type === 'NoteTodos' && (
            <React.Fragment>
              <input type='text' name='title' placeholder='Title' value={title} onChange={handleChange} className='add-note-title' />
              <ul>
                {todos.map((todo, idx) => (
                  <li key={idx}>
                    <input type='text' value={todo.txt} onChange={(ev) => handleTodoChange(ev, idx)} placeholder='Todo item' />
                  </li>
                ))}
              </ul>
              <button type='submit' className='add-note-btn'>
                Add Todos Note
              </button>
              <button onClick={handleExpandFalse} type='button'>
                x
              </button>
            </React.Fragment>
          )}
          {isExpanded && type === 'NoteImg' && (
            <React.Fragment>
              <input type='text' name='title' placeholder='Title' value={title} onChange={handleChange} className='add-note-title' />
              <input type='file' accept='image/*' onChange={handleFileChange} />
              {imgPreview && (
                <div className='img-preview'>
                  <img src={imgPreview} alt='Preview' style={{ maxWidth: '250px', maxHeight: '250px' }} />
                </div>
              )}
              <button type='submit' className='add-note-btn'>
                Add Img Note
              </button>
              <button onClick={handleExpandFalse} type='button'>
                x
              </button>
            </React.Fragment>
          )}

          {isExpanded && type === 'NoteVideo' && (
            <React.Fragment>
              <input type='text' name='title' placeholder='Title' value={title} onChange={handleChange} className='add-note-title' />
              <input type='file' name='video' accept='video/*' onChange={handleVideoChange} />
              {videoPreview && (
                <div className='video-preview'>
                  <video width='250' height='250'>
                    <source src={videoPreview} type='video/mp4' />
                  </video>
                </div>
              )}
              <button type='submit' className='add-note-btn'>
                Add Video Note
              </button>
              <button onClick={handleExpandFalse} type='button'>
                x
              </button>
            </React.Fragment>
          )}
        </div>
      </form>

      <button className='txt-btn-note' onClick={() => setNoteType('NoteTxt')}>
        Text
      </button>

      <button
        className='todos-btn-note'
        onClick={() => {
          setNoteType('NoteTodos')
          handleExpand()
        }}
      >
        Todos
      </button>

      <button
        className='img-btn-note'
        onClick={() => {
          setNoteType('NoteImg')
          handleExpand()
        }}
      >
        Img
      </button>

      <button
        className='video-btn-note'
        onClick={() => {
          setNoteType('NoteVideo')
          handleExpand()
        }}
      >
        Video
      </button>
    </React.Fragment>
  )
}
