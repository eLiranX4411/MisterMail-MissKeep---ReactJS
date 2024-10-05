import { loadFromStorage, makeId, saveToStorage } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'
import { utilService } from '../../../services/util.service.js'

const NOTE_KEY = 'noteDB'

export const noteService = {
  query,
  get,
  remove,
  save,
  getDefaultFilter,
  getFilterFromSearchParams,
  debounce
}

var gNotes = [
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
    if (!notes || !notes.length) {
      saveToStorage(NOTE_KEY, gNotes)
      notes = gNotes
    }

    if (filterBy.title) {
      const regex = new RegExp(filterBy.title, 'i')
      notes = notes.filter((note) => regex.test(note.title))
    }

    if (filterBy.type) {
      notes = notes.filter((note) => note.type >= filterBy.type)
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

function getDefaultFilter() {
  return {
    title: '',
    type: ''
  }
}

function getFilterFromSearchParams(searchParams) {
  const title = searchParams.get('title') || ''
  const type = searchParams.get('type') || ''
  return {
    type,
    title
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

//////////////////////TrashCan///////////////////////////
/*

function _createNotes() {
  let notes = loadFromStorage(NOTE_KEY)
  if (!notes || !notes.length) {
    notes = [_createTxtNote('NoteTxt'), _createImgNote('NoteImg'), _createTodoNote('NoteTodos')]
    saveToStorage(NOTE_KEY, notes)
  }
}

function getEmptyTxtNote(type) {
  return {
    id: '',
    createdAt: Date.now(),
    type,
    isPinned: false,
    style: {
      backgroundColor: utilService.getRandomColor()
    },
    info: {
      title: 'note txt',
      txt: 'Empty Txt'
    }
  }
}

function getEmptyImgNote(type) {
  return {
    id: '',
    createdAt: Date.now(),
    type,
    isPinned: false,
    info: {
      url: 'http://some-img/me',
      title: 'Bobi and Me'
    },
    style: {
      backgroundColor: utilService.getRandomColor()
    }
  }
}

function getEmptyTodoNote(type) {
  return {
    id: '',
    createdAt: Date.now(),
    type,
    isPinned: false,
    info: {
      title: 'Get my stuff together',
      todos: [
        { txt: 'Todo #1 Txt', doneAt: null },
        { txt: 'Todo #2 Txt', doneAt: 187111111 }
      ]
    }
  }
}

function _createTxtNote(type) {
  const note = getEmptyTxtNote(type)
  note.id = makeId()
  return note
}

function _createImgNote(type) {
  const note = getEmptyImgNote(type)
  note.id = makeId()
  return note
}

function _createTodoNote(type) {
  const note = getEmptyTodoNote(type)
  note.id = makeId()
  return note
}

*/
