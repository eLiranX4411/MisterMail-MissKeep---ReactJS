import { MailPreview } from './MailPreview.jsx'

export function MailList({ mails }) {
  function handleStarMail(mailId) {
    console.log(`Toggling star for mail ID: ${mailId}`)
  }

  function handleRemoveMail(mailId) {
    console.log(`Removing mail with ID: ${mailId}`)
  }

  function handleToggleReadStatus(mailId) {
    console.log(`Toggling read status for mail ID: ${mailId}`)
  }

  function handleOpenMail(mailId) {
    console.log(`Opening mail with ID: ${mailId}`)
  }

  return (
    <div>
      {mails.map((mail) => (
        <MailPreview
          key={mail.id}
          mailId={mail.id}
          onToggleStar={handleStarMail}
          onDeleteMail={handleRemoveMail}
          onToggleRead={handleToggleReadStatus}
          onOpenMail={handleOpenMail}
        />
      ))}
    </div>
  )
}
