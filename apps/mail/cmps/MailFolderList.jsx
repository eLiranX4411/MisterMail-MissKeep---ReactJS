import { FilterButton } from './FilterButton.jsx'

export function MailFolderList({ activeFilter, setActiveFilter, mailCounts }) {
  const folderOptions = [
    { label: 'All Mails', filter: 'all', icon: '📧' },
    { label: 'Sent Mails', filter: 'sent', icon: '📤' },
    { label: 'Received Mails', filter: 'received', icon: '📥' },
    { label: 'Unread Mails', filter: 'unread', icon: '📭' },
    { label: 'Readed Mails', filter: 'readed', icon: '✉️' },
    { label: 'Starred Mails', filter: 'starred', icon: '⭐' },
    { label: 'Draft Mails', filter: 'draft', icon: '📝' },
    { label: 'Trash Mails', filter: 'trash', icon: '🗑️' },
  ]

  return (
    <div className='mail-folder-list'>
      <div className='filter-buttons'>
        {folderOptions.map((folder) => (
          <FilterButton
            key={folder.filter}
            isActive={activeFilter === folder.filter}
            onClick={() => setActiveFilter(folder.filter)}
            label={folder.label}
            count={mailCounts[folder.filter] || 0}
            icon={folder.icon}
          />
        ))}
      </div>
    </div>
  )
}
