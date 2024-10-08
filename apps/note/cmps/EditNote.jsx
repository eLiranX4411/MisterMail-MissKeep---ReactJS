import { noteService } from '../../../apps/note/services/note.service.js'

const { useState, useEffect, useRef } = React
const { useNavigate, useParams } = ReactRouterDOM

export function EditNote() {
  const [noteToEdit, setNoteToEdit] = useState(noteService.getEmptyNote())
  const { noteId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (noteId) loadNote()
  }, [noteId])

  function loadNote() {
    noteService
      .get(noteId)
      .then(setNoteToEdit)
      .catch((err) => {
        console.log('Problem getting note', err)
        navigate('/note/edit')
      })
  }

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    if (target.type === 'checkbox') value = target.checked

    setNoteToEdit((prevNote) => {
      if (['title', 'txt', 'img', 'video'].includes(field)) {
        return {
          ...prevNote,
          info: {
            ...prevNote.info,
            [field]: value
          }
        }
      }

      return {
        ...prevNote,
        [field]: value
      }
    })
  }

  function onSaveNote(ev) {
    ev.preventDefault()
    noteService
      .save(noteToEdit)
      .then((note) => {})
      .catch((err) => {
        console.log('err:', err)
      })
      .finally(() => {
        navigate('/note')
      })
  }

  function handleTodoChange() {
    console.log('Handle')
  }

  function handleTodoCheck() {
    console.log('Handle Check')
  }

  function onBack() {
    navigate('/note')
  }

  const { info, type } = noteToEdit

  return (
    <section className='note-edit'>
      <div className='note-edit-container'>
        <button onClick={onBack}>X</button>
        <form onSubmit={onSaveNote}>
          {/* Title */}
          <label htmlFor='title'>Title</label>
          <input type='text' value={info.title} onChange={handleChange} name='title' id='title' />

          {/* Text */}
          {type === 'NoteTxt' && (
            <React.Fragment>
              <label htmlFor='title'>Text</label>
              <input type='text' value={info.txt} onChange={handleChange} name='txt' id='txt' />
            </React.Fragment>
          )}
          {/* Todos */}
          {type === 'NoteTodos' && (
            <React.Fragment>
              <label htmlFor='todos'>Todos:</label>
              <ul>
                {info.todos.map((todo, idx) => (
                  <li key={idx}>
                    <input
                      type='text'
                      value={todo.txt}
                      onChange={(el) => handleTodoChange(el, idx)}
                      name={`todo-${idx}`}
                      id='todos'
                    />
                    <input
                      type='checkbox'
                      checked={todo.doneAt ? true : false}
                      onChange={(el) => handleTodoCheck(el, idx)}
                      name={`todo-done-${idx}`}
                      id='todos'
                    />
                  </li>
                ))}
              </ul>
            </React.Fragment>
          )}

          {/* Img */}
          {type === 'NoteImg' && (
            <React.Fragment>
              <label htmlFor='img'>Image URL</label>
              <input value={info.url} onChange={handleChange} type='text' name='img' id='img' />
            </React.Fragment>
          )}

          {/* Video */}
          {type === 'NoteVideo' && (
            <React.Fragment>
              <label htmlFor='video'>Video URL</label>
              <input value={info.url} onChange={handleChange} type='text' name='video' id='video' />
            </React.Fragment>
          )}

          <button>Save</button>
        </form>
      </div>
    </section>
  )
}
