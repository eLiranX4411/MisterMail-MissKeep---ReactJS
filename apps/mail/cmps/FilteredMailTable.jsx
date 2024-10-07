const { useState, useEffect } = React
import { mailService } from '../../../apps/mail/services/mail.service.js'
import { MailPreview } from './MailPreview.jsx'

export function FilteredMailTable({ activeFilter }) {
  const [mails, setMails] = useState([])

  useEffect(() => {
    loadMails()
  }, [activeFilter])

  function loadMails() {
    const filterMethodMap = {
      all: 'query',
      sent: 'getSentMails',
      received: 'getReceivedMails',
      unread: 'getUnreadMails',
      readed: 'getReadedMails',
      starred: 'getStarredMails',
      draft: 'getDraftMails',
      trash: 'getTrashMails',
    }

    const filterMethod = filterMethodMap[activeFilter]

    if (typeof mailService[filterMethod] === 'function') {
      mailService[filterMethod]()
        .then((loadedMails) => {
          setMails(loadedMails)
        })
        .catch((err) => {
          console.log('Problems getting filtered mails:', err)
        })
    } else {
      console.log(`Error: ${activeFilter} is not a valid filter in mailService`)
    }
  }

  function handleRemoveMail(mailId) {
    setMails(mails.filter((mail) => mail.id !== mailId))
  }

  if (mails.length === 0) {
    return <div>No mails found.</div>
  }

  return (
    <div>
      {mails.map((mail) => (
        <MailPreview key={mail.id} mailId={mail.id} onStarMail={() => console.log('Star mail:', mail.id)} onRemoveMail={() => handleRemoveMail(mail.id)} />
      ))}
    </div>
  )
}
