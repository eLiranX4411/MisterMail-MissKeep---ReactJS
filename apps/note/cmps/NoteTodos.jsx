export function NoteTodos({ note, onRemoveNote }) {
  return (
    <section className='note-todos-container'>
      <div className='note-todos-card'>
        <h3 className='note-todos-title'>{note.info.title}</h3>

        {note.info.todos.map((todo, idx) => (
          <ul key={idx}>
            <li className='todo-txt'>{todo.txt}</li>
          </ul>
        ))}
      </div>
    </section>
  )
}
