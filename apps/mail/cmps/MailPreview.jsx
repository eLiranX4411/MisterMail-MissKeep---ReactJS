const { useState, useEffect } = React
import { mailService } from '../../../apps/mail/services/mail.service.js'
import { LongTxt } from '../../../cmps/LongTxt.jsx'
import '../../../assets/css/apps/mail/cmps/mail-preview.css'

export function MailPreview({ mailId, onStarMail, onRemoveMail }) {
  const [mail, setMail] = useState(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    loadMail()
  }, [mailId])

  function loadMail() {
    mailService
      .get(mailId)
      .then(setMail)
      .catch((err) => {
        console.log('Error loading mail:', err)
      })
  }

  function formatDateOrTime(createdAt) {
    const mailDate = new Date(createdAt)
    const today = new Date()

    const isToday = mailDate.getDate() === today.getDate() && mailDate.getMonth() === today.getMonth() && mailDate.getFullYear() === today.getFullYear()

    return isToday ? mailDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : mailDate.toLocaleDateString('en-GB')
  }

  function renderSenderOrRecipient() {
    const isSentByUser = mail.from === 'user@appsus.com'
    return isSentByUser ? `To: ${mail.to}` : `From: ${mail.from}`
  }

  if (!mail) return <div>Loading...</div>

  return (
    <tr
      className={`mail-preview ${mail.isRead ? 'read' : 'unread'} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ border: '1px solid black' }}
    >
      <td className='icon-star' onClick={() => onStarMail(mail.id)}>
        {mail.isStarred ? '⭐' : '☆'}
      </td>
      <td className='sender-recipient'>{renderSenderOrRecipient()}</td>
      <td className='subject'>
        <LongTxt txt={mail.subject} length={20} onlyShort={true} />
      </td>
      <td className='body'>
        <LongTxt txt={mail.body} length={30} onlyShort={true} />
      </td>
      <td className='date'>{formatDateOrTime(mail.createdAt)}</td>
      <td className='actions'>
        {isHovered && (
          <div>
            <button onClick={() => onRemoveMail(mail.id)}>🗑️</button>
            <button onClick={() => console.log('Open mail:', mail.id)}>📧</button>
          </div>
        )}
      </td>
    </tr>
  )
}
