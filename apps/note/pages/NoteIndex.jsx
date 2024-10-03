const { useState, useEffect, useRef } = React
const { Link, useSearchParams } = ReactRouterDOM

import { showErrorMsg, showSuccessMsg, showUserMsg } from '../../../services/event-bus.service.js'
import { noteService } from '../../../apps/note/services/note.service.js'

export function NoteIndex() {
  return <div>note app</div>
}
