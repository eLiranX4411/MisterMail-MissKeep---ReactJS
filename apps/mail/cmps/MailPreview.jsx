const { useEffect, useState } = React
import { LongTxt } from '../../../cmps/LongTxt.jsx'
import { mailService } from '../services/mail.service.js'

export function MailPreview({ mailId, onOpenMail, onToggleStar, onToggleRead, onDeleteMail }) {
  const [mail, setMail] = useState(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    mailService.get(mailId).then((fetchedMail) => setMail(fetchedMail))
  }, [mailId])

  if (!mail) return null

  function handleMailClick() {
    onOpenMail(mailId)
  }

  function handleStarClick(ev) {
    ev.stopPropagation()
    onToggleStar(mailId)
  }

  function handleReadClick(ev) {
    ev.stopPropagation()
    onToggleRead(mailId)
  }

  function handleDeleteClick(ev) {
    ev.stopPropagation()
    onDeleteMail(mailId)
  }

  function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  function isToday(date) {
    const today = new Date()
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
  }

  function displayDateOrTime(createdAt) {
    const date = new Date(createdAt)
    return isToday(date) ? formatTime(date) : formatDate(date)
  }

  return (
    <div
      className={`mail-preview ${mail.isRead ? 'read' : 'unread'}`}
      onClick={handleMailClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <section className='mail-star' onClick={handleStarClick}>
        {mail.isStarred ? '★' : '☆'}
      </section>

      <section className='mail-from-to'>
        {mail.status === 'draft' ? <span className='draft-text'>Draft</span> : mail.from === 'user@appsus.com' ? `To: ${mail.to}` : `From: ${mail.from}`}
      </section>

      <section className='mail-subject'>
        <LongTxt txt={mail.subject} length={30} onlyShort={true} />
      </section>

      <section className='mail-body'>
        <LongTxt txt={mail.body} length={50} onlyShort={true} />
      </section>

      <section className='mail-date-controls'>
        {!isHovered ? (
          <span>{displayDateOrTime(mail.createdAt)}</span>
        ) : (
          <div className='mail-controls'>
            <button className='mail-toggle-read' onClick={handleReadClick}>
              {mail.isRead ? '✉️' : '📭'}
            </button>
            <button className='mail-delete' onClick={handleDeleteClick}>
              🗑️
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
