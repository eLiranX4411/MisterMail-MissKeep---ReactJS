const { useState, useEffect, useRef } = React
import { mailService } from '../../../apps/mail/services/mail.service.js'
import { MailPreview } from './MailPreview.jsx'

export function FilteredMailTable({ filterMethod, onRemoveMail }) {
  const [mails, setMails] = useState([])

  useEffect(() => {
    loadMails()
  }, [filterMethod])

  function loadMails() {
    mailService[filterMethod]()
      .then(setMails)
      .catch((err) => {
        console.log('Problems getting filtered mails:', err)
      })
  }

  return (
    <div>
      {mails.map((mail) => (
        <MailPreview key={mail.id} mailId={mail.id} onStarMail={() => console.log('Star mail:', mail.id)} onRemoveMail={onRemoveMail} />
      ))}
    </div>
  )
}
