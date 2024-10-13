const { useState, useEffect } = React
const { useParams, useSearchParams, useNavigate } = ReactRouterDOM

import { mailService } from '../services/mail.service.js'

export function MailCompose() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { mailId } = useParams()

  const [mail, setMail] = useState({
    to: '',
    subject: searchParams.get('subject') || '',
    body: searchParams.get('body') || '',
    from: 'user@appsus.com',
    isDraft: true,
    isRead: false,
    isStarred: false,
    isTrash: false,
    labels: [],
    readAt: null,
    removedAt: null,
    sentAt: null,
    createdAt: Date.now(),
  })

  const loggedinUser = mailService.getLoggedInUser()

  useEffect(() => {
    if (mailId) {
      mailService.get(mailId).then((loadedMail) => {
        if (loadedMail.isDraft) {
          setMail(loadedMail)
        } else {
          alert('Cannot edit this email. It is not a draft.')
          navigate('/mail/edit')
        }
      })
    }
  }, [mailId, navigate])

  function handleChange(ev) {
    const { name, value } = ev.target
    setMail((prevMail) => ({ ...prevMail, [name]: value }))
  }

  function onSendMail() {
    if (!mail.to || !mail.subject || !mail.body) {
      alert('Please fill all fields before sending the mail.')
      return
    }

    const newMail = {
      ...mail,
      isDraft: false,
      sentAt: Date.now(),
    }

    mailService.send(newMail).then(() => {
      navigate('/mail')
    })
  }

  function onSaveDraft() {
    const draftMail = {
      ...mail,
      isDraft: true,
      createdAt: mail.createdAt || Date.now(),
    }

    mailService.saveDraft(draftMail).then(() => {
      navigate('/mail')
    })
  }

  return (
    <div className='compose-container'>
      <div className='compose-box'>
        <div className='compose-header'>
          <button className='compose-close-btn' onClick={onSaveDraft}>
            ✖
          </button>
          New Message {mail.isDraft && <span style={{ color: 'red' }}>(Draft)</span>}
        </div>
        <div className='compose-content'>
          <div className='input-group'>
            <label>From:</label>
            <span>{loggedinUser.email}</span>
          </div>
          <div className='input-group'>
            <label>To:</label>
            <input type='text' name='to' value={mail.to} onChange={handleChange} />
          </div>
          <div className='input-group'>
            <label>Subject:</label>
            <input type='text' name='subject' value={mail.subject} onChange={handleChange} />
          </div>
          <div className='input-group'>
            <label>Body:</label>
            <textarea name='body' rows='5' value={mail.body} onChange={handleChange}></textarea>
          </div>
        </div>
        <div className='compose-footer'>
          <button className='compose-btn-send' onClick={onSendMail}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
