import { loadFromStorage, makeId, saveToStorage } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const NOTE_KEY = 'noteDB'
_createNotes()

export const noteService = {
  query,
  get,
  remove,
  save,
  getEmptyNote,
  getDefaultFilter,
  getFilterFromSearchParams,
  debounce
}

const notes = [
  {
    id: 'n101',
    createdAt: 1112222,
    type: 'NoteTxt',
    isPinned: true,
    style: {
      backgroundColor: '#00d'
    },
    info: {
      txt: 'Fullstack Me Baby!'
    }
  },
  {
    id: 'n102',
    createdAt: 1112223,
    type: 'NoteImg',
    isPinned: false,
    info: {
      url: 'http://some-img/me',
      title: 'Bobi and Me'
    },
    style: {
      backgroundColor: '#00d'
    }
  },
  {
    id: 'n103',
    createdAt: 1112224,
    type: 'NoteTodos',
    isPinned: false,
    info: {
      title: 'Get my stuff together',
      todos: [
        { txt: 'Driving license', doneAt: null },
        { txt: 'Coding power', doneAt: 187111111 }
      ]
    }
  }
]

function query(filterBy = {}) {
  return storageService.query(NOTE_KEY).then((notes) => {
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, 'i')
      notes = notes.filter((note) => regExp.test(note.type))
    }
    return notes
  })
}

function get(noteId) {
  return storageService.get(NOTE_KEY, noteId).then((note) => _setNextPrevNoteId(note))
}

function remove(noteId) {
  // return Promise.reject('Oh No!')
  return storageService.remove(NOTE_KEY, noteId)
}

function save(note) {
  if (note.id) {
    return storageService.put(NOTE_KEY, note)
  } else {
    return storageService.post(NOTE_KEY, note)
  }
}

function getEmptyNote(type = '') {
  return { type }
}

function getDefaultFilter() {
  return {
    txt: ''
  }
}

function _createNotes() {
  let notes = loadFromStorage(NOTE_KEY)
  if (!notes || !notes.length) {
    notes = [_createNote('hey i am a note text')]
    saveToStorage(NOTE_KEY, notes)
  }
}

function _createNote(type) {
  const note = getEmptyNote(type)
  note.id = makeId()
  return note
}

function getFilterFromSearchParams(searchParams) {
  const txt = searchParams.get('txt') || ''
  return {
    txt
  }
}

function _setNextPrevNoteId(note) {
  return query().then((notes) => {
    const noteIdx = notes.findIndex((currNote) => currNote.id === note.id)
    const nextNote = notes[noteIdx + 1] ? notes[noteIdx + 1] : notes[0]
    const prevNote = notes[noteIdx - 1] ? notes[noteIdx - 1] : notes[notes.length - 1]
    note.nextNotelId = nextNote.id
    note.prevNoteId = prevNote.id
    return note
  })
}

function debounce(func, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
