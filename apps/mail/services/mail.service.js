import { loadFromStorage, makeId, saveToStorage } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const MAIL_KEY = 'mailDB'
_createMails()

export const mailService = {
  query,
  get,
  remove,
  save,
  getEmptyMail,
  getDefaultFilter,
  getFilterFromSearchParams,
  debounce
}

const loggedinUser = {
  email: 'user@appsus.com',
  fullname: 'Mahatma Appsus'
}

const mail = {
  id: 'e101',
  createdAt: 1551133930500,
  subject: 'Miss you!',
  body: 'Would love to catch up sometimes',
  isRead: false,
  sentAt: 1551133930594,
  removedAt: null,
  from: 'momo@momo.com',
  to: 'user@appsus.com'
}

const filterBy = {
  status: 'inbox/sent/trash/draft',
  txt: 'puki', // no need to support complex text search
  isRead: true, // (optional property, if missing: show all)
  isStared: true, // (optional property, if missing: show all)
  lables: ['important', 'romantic'] // has any of the labels
}

function query(filterBy = {}) {
  return storageService.query(MAIL_KEY).then((mails) => {
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, 'i')
      mails = mails.filter((mail) => regExp.test(mail.subject))
    }
    return mails
  })
}

function get(mailId) {
  return storageService.get(MAIL_KEY, mailId).then((mail) => _setNextPrevMailId(mail))
}

function remove(mailId) {
  // return Promise.reject('Oh No!')
  return storageService.remove(MAIL_KEY, mailId)
}

function save(mail) {
  if (mail.id) {
    return storageService.put(MAIL_KEY, mail)
  } else {
    return storageService.post(MAIL_KEY, mail)
  }
}

function getEmptyMail(subject = '') {
  return { subject }
}

function getDefaultFilter() {
  return {
    txt: ''
  }
}

function _createMails() {
  let mails = loadFromStorage(MAIL_KEY)
  if (!mails || !mails.length) {
    mails = [_createMail('hey i am a mail text')]
    saveToStorage(MAIL_KEY, mails)
  }
}

function _createMail(subject) {
  const mail = getEmptyMail(subject)
  mail.id = makeId()
  return mail
}

function getFilterFromSearchParams(searchParams) {
  const txt = searchParams.get('txt') || ''
  return {
    txt
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
