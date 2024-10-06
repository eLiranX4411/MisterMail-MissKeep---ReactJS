export function NoteTodos({ note }) {
  return (
    <section className='note-todos-container'>
      <div className='note-todos-card'>
        <h3 className='note-todos-title'>{note.info.title}</h3>

        {note.info.todos.map((todo, idx) => (
          <ul key={idx}>
            <li className='todo-txt'>
              <input type='checkbox' name='todos' id='todos' /> {todo.txt}
            </li>
          </ul>
        ))}
      </div>
    </section>
  )
}
