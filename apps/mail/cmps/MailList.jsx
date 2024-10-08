import { MailPreview } from './MailPreview.jsx'

export function MailList({ mails, onStarMail, onRemoveMail, onToggleRead, onOpenMail }) {
  return (
    <div>
      {mails.map((mail) => (
        <MailPreview key={mail.id} mailId={mail.id} onToggleStar={onStarMail} onDeleteMail={onRemoveMail} onToggleRead={onToggleRead} onOpenMail={onOpenMail} />
      ))}
    </div>
  )
}
