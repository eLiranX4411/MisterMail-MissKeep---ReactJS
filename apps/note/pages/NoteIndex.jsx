const { useState, useEffect, useRef } = React
const { Link, useSearchParams } = ReactRouterDOM

import { showErrorMsg, showSuccessMsg, showUserMsg } from '../../../services/event-bus.service.js'
import { noteService } from '../../../apps/note/services/note.service.js'
import { getTruthyValues } from '../../../services/util.service.js'

export function NoteIndex() {
  const [note, setNotes] = useState(null)
  const [searchPrms, setSearchPrms] = useSearchParams()
  const [filterBy, setFilterBy] = useState(noteService.getFilterFromSearchParams(searchPrms))

  useEffect(() => {
    loadNotes()
    setSearchPrms(getTruthyValues(filterBy))
  }, [filterBy])

  function loadNotes() {
    noteService
      .query(filterBy)
      .then(setNotes)
      .catch((err) => {
        console.log('Problems getting note:', err)
      })
  }

  function onRemoveNote(noteId) {
    noteService
      .remove(noteId)
      .then(() => {
        setNotes((notes) => notes.filter((note) => note.id !== noteId))
        showSuccessMsg(`Note removed successfully!`)
      })
      .catch((err) => {
        console.log('Problems removing note:', err)
        showErrorMsg(`Problems removing note (${noteId})`)
      })
  }

  function onSetFilterBy(filterBy) {
    setFilterBy((preFilter) => ({ ...preFilter, ...filterBy }))
  }
  return <div>notes app</div>
}
