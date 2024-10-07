const { useState, useEffect } = React
import { FilteredMailTable } from '../cmps/FilteredMailTable.jsx'

export function MailIndex() {
  const [activeFilter, setActiveFilter] = useState('all')

  function onSetFilterBy(filter) {
    setActiveFilter(filter)
  }

  return (
    <div className='mail-index-container'>
      <div className='filter-buttons'>
        <button onClick={() => onSetFilterBy('all')}>All Mails</button>
        <button onClick={() => onSetFilterBy('sent')}>Sent Mails</button>
        <button onClick={() => onSetFilterBy('received')}>Received Mails</button>
        <button onClick={() => onSetFilterBy('unread')}>Unread Mails</button>
        <button onClick={() => onSetFilterBy('readed')}>Readed Mails</button>
        <button onClick={() => onSetFilterBy('starred')}>Starred Mails</button>
        <button onClick={() => onSetFilterBy('draft')}>Draft Mails</button>
        <button onClick={() => onSetFilterBy('trash')}>Trash Mails</button>
      </div>

      <div className='mail-table'>
        <FilteredMailTable activeFilter={activeFilter} />
      </div>
    </div>
  )
}
