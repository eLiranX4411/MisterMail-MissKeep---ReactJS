import { loadFromStorage, makeId, saveToStorage } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const MAIL_KEY = 'mailsDB'

export const mailService = {
  query,
  get,
  remove,
  save,
  getEmptyMail,
  getDefaultFilter,
  getFilterFromSearchParams,
  debounce,
}

const loggedinUser = {
  email: 'user@appsus.com',
  fullname: 'Mahatma Appsus',
}

function query(filterBy = {}) {
  return storageService.query(MAIL_KEY).then((mails) => {
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, 'i')
      mails = mails.filter((mail) => regExp.test(mail.subject) || regExp.test(mail.body))
    }
    if (filterBy.status) {
      mails = mails.filter((mail) => mail.status === filterBy.status)
    }
    if (filterBy.isRead !== undefined) {
      mails = mails.filter((mail) => mail.isRead === filterBy.isRead)
    }
    if (filterBy.isStarred !== undefined) {
      mails = mails.filter((mail) => mail.isStarred === filterBy.isStarred)
    }
    return mails
  })
}

function get(mailId) {
  return storageService.get(MAIL_KEY, mailId).then((mail) => _setNextPrevMailId(mail))
}

function remove(mailId) {
  return storageService.remove(MAIL_KEY, mailId)
}

function save(mail) {
  if (mail.id) {
    return storageService.put(MAIL_KEY, mail)
  } else {
    mail.id = makeId()
    mail.createdAt = Date.now()
    mail.from = loggedinUser.email
    return storageService.post(MAIL_KEY, mail)
  }
}

function getEmptyMail(subject = '', body = '') {
  return {
    id: '',
    createdAt: null,
    subject,
    body,
    sentAt: null,
    from: loggedinUser.email,
    to: '',
    status: 'draft',
    isRead: false,
    readAt: null,
    removedAt: null,
    isStarred: false,
  }
}

function getDefaultFilter() {
  return {
    txt: '',
    status: '',
    isRead: undefined,
    isStarred: undefined,
  }
}

function getFilterFromSearchParams(searchParams) {
  const txt = searchParams.get('txt') || ''
  const status = searchParams.get('status') || ''
  const isRead = searchParams.get('isRead') ? searchParams.get('isRead') === 'true' : undefined
  const isStarred = searchParams.get('isStarred') ? searchParams.get('isStarred') === 'true' : undefined
  return {
    txt,
    status,
    isRead,
    isStarred,
  }
}

function _setNextPrevMailId(mail) {
  return query().then((mails) => {
    const mailIdx = mails.findIndex((currMail) => currMail.id === mail.id)
    const nextMail = mails[mailIdx + 1] ? mails[mailIdx + 1] : mails[0]
    const prevMail = mails[mailIdx - 1] ? mails[mailIdx - 1] : mails[mails.length - 1]
    mail.nextMailId = nextMail.id
    mail.prevMailId = prevMail.id
    return mail
  })
}

function debounce(func, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
