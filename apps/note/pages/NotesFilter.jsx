const { useState, useEffect, useRef } = React

export function NotesFilter({ filterBy, onSetFilterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

  useEffect(() => {
    onSetFilterBy(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
  }

  const { title } = filterByToEdit

  return (
    <section className='filter-by'>
      <label htmlFor='title'>
        <input onChange={handleChange} value={title} type='search' name='title' id='title' placeholder='Search By Title' />
      </label>

      <select onChange={handleChange} name='type' id='type'>
        <option value=''>Filter By</option>
        <option value='NoteTxt'>Text</option>
        <option value='NoteImg'>Imgs</option>
        <option value='NoteTodos'>Todos</option>
        <option value='NoteVideo'>Videos</option>
      </select>
    </section>
  )
}
