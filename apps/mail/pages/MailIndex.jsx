const { useState, useEffect } = React
import { mailService } from '../../../apps/mail/services/mail.service.js'
import { mailLoaderService } from '../../../apps/mail/services/mailLoaderService.js'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailList } from '../cmps/MailList.jsx' // קומפוננטה להצגת המיילים

export function MailIndex() {
  const [mails, setMails] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true) // ניהול מצב הטעינה
  const [mailCounts, setMailCounts] = useState({}) // ניהול מספר המיילים בכל קטגוריה

  useEffect(() => {
    setLoading(true)
    loadInitialData() // טוען את הנתונים מהזיכרון לפני כל פעולה
  }, [])

  useEffect(() => {
    setLoading(true)
    loadMails() // טוען מיילים כאשר הפילטר משתנה
  }, [activeFilter])

  useEffect(() => {
    updateMailCounts() // עדכון מספר המיילים בהתחלה ובכל שינוי
  }, [])

  function loadInitialData() {
    mailLoaderService
      .loadInitialMails() // קריאה ל-loader service לטעינה ראשונית של המיילים
      .then(() => {
        loadMails() // טוען את המיילים לאחר טעינת הנתונים הראשונית
        updateMailCounts() // מעדכן את מספר המיילים לאחר טעינת הנתונים
      })
      .catch((err) => {
        console.log('Error loading initial mails:', err)
        setLoading(false)
      })
  }

  function loadMails(filter = activeFilter) {
    setActiveFilter(filter) // מעדכן את הפילטר
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
        setMails(mails)
        setLoading(false)
      })
      .catch((err) => {
        console.log('Error loading mails:', err)
        setLoading(false)
      })
  }

  function updateMailCounts() {
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
        setMailCounts(newCounts)
      })
      .catch((err) => console.log('Error updating mail counts:', err))
  }

  return (
    <div className='mail-index-container'>
      <MailFolderList
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter} // שינוי הפילטר מעדכן את מצב ה-activeFilter
        mailCounts={mailCounts} // מספר המיילים בכל קטגוריה
      />
      <MailList mails={mails} loading={loading} />
    </div>
  )
}
