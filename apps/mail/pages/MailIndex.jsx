const { useState, useEffect, useRef } = React
const { Link, useSearchParams } = ReactRouterDOM

import { showErrorMsg, showSuccessMsg, showUserMsg } from '../../../services/event-bus.service.js'
import { mailService } from '../../../apps/mail/services/mail.service.js'
import { mailLoaderService } from '../../../apps/mail/services/mailLoaderService.js'
import { getTruthyValues } from '../../../services/util.service.js'
import { FilteredMailTable } from '../cmps/FilteredMailTable.jsx'

export function MailIndex() {
  const [mails, setMails] = useState([])
  const [searchPrms, setSearchPrms] = useSearchParams()
  const [filterBy, setFilterBy] = useState(mailService.getFilterFromSearchParams(searchPrms))

  useEffect(() => {
    mailLoaderService.loadInitialMails().then(() => {
      loadMails()
    })
    setSearchPrms(getTruthyValues(filterBy))
  }, [filterBy])

  function loadMails() {
    mailService
      .query(filterBy)
      .then(setMails)
      .catch((err) => {
        console.log('Problems getting mail:', err)
      })
  }

  function onRemoveMail(mailId) {
    mailService
      .remove(mailId)
      .then(() => {
        setMails((mails) => mails.filter((mail) => mail.id !== mailId))
        showSuccessMsg(`Mail removed successfully!`)
      })
      .catch((err) => {
        console.log('Problems removing mail:', err)
        showErrorMsg(`Problems removing mail (${mailId})`)
      })
  }

  function onSetFilterBy(filterBy) {
    setFilterBy((preFilter) => ({ ...preFilter, ...filterBy }))
  }

  return (
    <div>
      <details open>
        <summary>All Mails</summary>
        <FilteredMailTable filterMethod='query' onRemoveMail={onRemoveMail} />
      </details>

      <details>
        <summary>Sent Mails</summary>
        <FilteredMailTable filterMethod='getSentMails' onRemoveMail={onRemoveMail} />
      </details>

      <details>
        <summary>Received Mails</summary>
        <FilteredMailTable filterMethod='getReceivedMails' onRemoveMail={onRemoveMail} />
      </details>

      <details>
        <summary>Unread Mails</summary>
        <FilteredMailTable filterMethod='getUnreadMails' onRemoveMail={onRemoveMail} />
      </details>

      <details>
        <summary>Readed Mails</summary>
        <FilteredMailTable filterMethod='getReadedMails' onRemoveMail={onRemoveMail} />
      </details>

      <details>
        <summary>Starred Mails</summary>
        <FilteredMailTable filterMethod='getStarredMails' onRemoveMail={onRemoveMail} />
      </details>

      <details>
        <summary>Draft Mails</summary>
        <FilteredMailTable filterMethod='getDraftMails' onRemoveMail={onRemoveMail} />
      </details>

      <details>
        <summary>Trash Mails</summary>
        <FilteredMailTable filterMethod='getTrashMails' onRemoveMail={onRemoveMail} />
      </details>
    </div>
  )
}
