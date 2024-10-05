const { useState, useEffect, useRef } = React
import { noteService } from '../../../apps/note/services/note.service.js'

export function NotesFilter() {
  const [filterBy, setFilterBy] = useState(noteService.getDefaultFilter())
  return (
    <label htmlFor='title'>
      <input type='search' name='title' id='title' placeholder='Search' />
    </label>
  )
}
