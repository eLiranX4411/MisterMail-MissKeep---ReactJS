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

  function handleTodoChange(ev, idx) {
    const value = ev.target.value
    setNoteToEdit((prevNote) => {
      const updatedTodos = [...prevNote.info.todos]
      updatedTodos[idx].txt = value
      return { ...prevNote, info: { ...prevNote.info, todos: updatedTodos } }
    })
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
                    <input type='text' value={todo.txt} onChange={(ev) => handleTodoChange(ev, idx)} name={`todo-${idx}`} id='todos' />
                  </li>
                ))}
              </ul>
            </React.Fragment>
          )}

          <button>Save</button>
        </form>
      </div>
    </section>
  )
}
