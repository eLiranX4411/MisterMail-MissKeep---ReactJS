const { useState, useEffect } = React
import { mailService } from '../../../apps/mail/services/mail.service.js'
import { mailLoaderService } from '../../../apps/mail/services/mailLoaderService.js'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailList } from '../cmps/MailList.jsx'

export function MailIndex() {
  const [mails, setMails] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [mailCounts, setMailCounts] = useState({})

  useEffect(() => {
    setLoading(true)
    loadInitialData()
  }, [])

  useEffect(() => {
    setLoading(true)
    loadMails()
  }, [activeFilter])

  useEffect(() => {
    updateMailCounts()
  }, [mails])

  function loadInitialData() {
    console.log('Loading initial data...')
    mailLoaderService
      .loadInitialMails()
      .then(() => {
        console.log('Initial data loaded.')
        loadMails()
        updateMailCounts()
      })
      .catch((err) => {
        console.log('Error loading initial mails:', err)
        setLoading(false)
      })
  }

  function loadMails(filter = activeFilter) {
    console.log(`Loading mails with filter: ${filter}`)
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

    mailService[filterMethodMap[filter]]()
      .then((mails) => {
        console.log(`Loaded ${mails.length} mails with filter: ${filter}`)
        setMails(mails)
        setLoading(false)
      })
      .catch((err) => {
        console.log('Error loading mails:', err)
        setLoading(false)
      })
  }

  function updateMailCounts() {
    console.log('Updating mail counts...')
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

    const mailTypes = ['all', 'sent', 'received', 'unread', 'readed', 'starred', 'draft', 'trash']
    const countsPromises = mailTypes.map((type) => mailService[filterMethodMap[type]]())

    Promise.all(countsPromises)
      .then((results) => {
        const newCounts = results.reduce((acc, mails, idx) => {
          acc[mailTypes[idx]] = mails.length
          return acc
        }, {})
        console.log('Mail counts updated:', newCounts)
        setMailCounts(newCounts)
      })
      .catch((err) => console.log('Error updating mail counts:', err))
  }

  function handleStarMail(mailId) {
    console.log(`Toggling star for mail ID: ${mailId}`)
    mailService.updateStarStatus(mailId).then(() => {
      console.log(`Mail ID: ${mailId} star status updated.`)
      loadMails() // רענון רשימת המיילים בהתאם לפילטר הנוכחי
      updateMailCounts() // עדכון ספירת המיילים בכל קטגוריה
    })
  }

  function handleRemoveMail(mailId) {
    console.log(`Moving mail ID: ${mailId} to trash`)
    mailService.moveToTrash(mailId).then(() => {
      console.log(`Mail ID: ${mailId} moved to trash.`)
      loadMails()
      updateMailCounts()
    })
  }

  function handleToggleReadStatus(mailId) {
    console.log(`Toggling read status for mail ID: ${mailId}`)
    mailService.toggleReadStatus(mailId).then(() => {
      console.log(`Mail ID: ${mailId} read status updated.`)
      loadMails()
      updateMailCounts()
    })
  }

  function handleOpenMail(mailId) {
    console.log(`Opening mail with ID: ${mailId}`)
    // תוכל להוסיף פה פעולה נוספת לפתיחת המייל אם תרצה
  }

  return (
    <div className='mail-index-container'>
      <MailFolderList activeFilter={activeFilter} setActiveFilter={setActiveFilter} mailCounts={mailCounts} />
      <MailList
        mails={mails}
        loading={loading}
        onStarMail={handleStarMail}
        onRemoveMail={handleRemoveMail}
        onToggleRead={handleToggleReadStatus}
        onOpenMail={handleOpenMail}
      />
    </div>
  )
}
