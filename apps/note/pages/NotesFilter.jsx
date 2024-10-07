import { filterIconSvg } from '../../../apps/note/cmps/SvgIcons.jsx'

const { useState, useEffect, useRef } = React

export function NotesFilter({ filterBy, onSetFilterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // For toggling dropdown

  useEffect(() => {
    onSetFilterBy(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
  }

  function toggleDropdown() {
    setIsDropdownOpen((prevState) => !prevState)
  }

  function resetFilter() {
    setFilterByToEdit({ title: '', type: '' })
  }

  const { title } = filterByToEdit

  return (
    <section className='filter-by'>
      <label htmlFor='title'>
        <input onChange={handleChange} value={title} type='search' name='title' id='title' placeholder='🍷 Search' />
      </label>

      <div className='hamburger-icon-filter'>
        <button className='hamburger-btn' onClick={toggleDropdown}>
          <div>{filterIconSvg.filterIcon}</div>
        </button>

        {isDropdownOpen && (
          <ul className='custom-dropdown'>
            <li onClick={resetFilter}>Show All</li>
            <li onClick={() => handleChange({ target: { name: 'type', value: 'NoteTxt' } })}>Text</li>
            <li onClick={() => handleChange({ target: { name: 'type', value: 'NoteImg' } })}>Imgs</li>
            <li onClick={() => handleChange({ target: { name: 'type', value: 'NoteTodos' } })}>Todos</li>
            <li onClick={() => handleChange({ target: { name: 'type', value: 'NoteVideo' } })}>Videos</li>
          </ul>
        )}
      </div>
    </section>
  )
}
