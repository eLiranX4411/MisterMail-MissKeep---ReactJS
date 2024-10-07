import { NoteTxt } from '../../../apps/note/cmps/NoteTxt.jsx'
import { NoteImg } from '../../../apps/note/cmps/NoteImg.jsx'
import { NoteTodos } from '../../../apps/note/cmps/NoteTodos.jsx'
import { NoteVideo } from '../../../apps/note/cmps/NoteVideo.jsx'

const { useState } = React

export function NotePreview({ note, onRemoveNote, onPinnedNote }) {
  const [cmpType, setCmpType] = useState(note.type)

  return (
    <section className='notes-preview'>
      <DynamicCmp cmpType={cmpType} note={note} onRemoveNote={onRemoveNote} />
      <div className='notes-actions'>
        <button onClick={() => onRemoveNote(note.id)}>Remove</button>
        <button onClick={() => onPinnedNote(note.id)}>Pin</button>
        <button>Duplicate</button>
        <button>Edit</button>
      </div>
    </section>
  )
}

function DynamicCmp(props) {
  switch (props.cmpType) {
    case 'NoteTxt':
      return <NoteTxt {...props} />

    case 'NoteImg':
      return <NoteImg {...props} />

    case 'NoteTodos':
      return <NoteTodos {...props} />

    case 'NoteVideo':
      return <NoteVideo {...props} />
  }
}
