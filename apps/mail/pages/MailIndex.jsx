const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM
import { mailService } from '../../../apps/mail/services/mail.service.js'
import { mailLoaderService } from '../../../apps/mail/services/mailLoaderService.js'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailList } from '../cmps/MailList.jsx'
import { MailFilter } from '../cmps/MailFilter.jsx'

export function MailIndex() {
  const [mails, setMails] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [filterBy, setFilterBy] = useState({})
  const [loading, setLoading] = useState(true)
  const [mailCounts, setMailCounts] = useState({})
  const navigate = useNavigate()

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

    if (filter === 'custom') {
      console.log('Applying custom filter:', filterBy)
      mailService.queryByFilter(filterBy).then((filteredMails) => {
        console.log('Filtered mails:', filteredMails)
        setMails(filteredMails)
        setLoading(false)
      })
    } else {
      mailService[filterMethodMap[filter]]()
        .then((mails) => {
          console.log(`Loaded ${mails.length} mails with filter: ${filter}`)
          console.log('Mails:', mails)
          setMails(mails)
          setLoading(false)
        })
        .catch((err) => {
          console.log('Error loading mails:', err)
          setLoading(false)
        })
    }
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
      loadMails()
      updateMailCounts()
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
    mailService.get(mailId).then((mail) => {
      console.log(mail)

      if (!mail.isRead) {
        mailService.updateReadStatus(mailId, true).then(() => {
          console.log(`Mail ID: ${mailId} marked as read.`)
        })
      }

      if (mail.isDraft) {
        navigate(`/mail/edit/${mailId}`)
      } else {
        navigate(`/mail/details/${mailId}`)
      }
    })
  }

  function handleComposeClick() {
    navigate('/mail/edit')
  }

  function handleSetFilter(newFilter) {
    console.log('Setting new filter:', newFilter)
    setFilterBy(newFilter)
    setActiveFilter('custom')
    loadMails('custom')
  }

  return (
    <div className='mail-index-container'>
      <section className='section-a'>
        <button className='compose-btn' onClick={handleComposeClick}>
          ✏️
          <span className='text'>Compose</span>
        </button>
        <MailFilter onSetFilter={handleSetFilter} />
      </section>

      <section className='section-b'>
        <MailFolderList activeFilter={activeFilter} setActiveFilter={setActiveFilter} mailCounts={mailCounts} />
        <MailList
          mails={mails}
          loading={loading}
          onStarMail={handleStarMail}
          onRemoveMail={handleRemoveMail}
          onToggleRead={handleToggleReadStatus}
          onOpenMail={handleOpenMail}
        />
      </section>
    </div>
  )
}
