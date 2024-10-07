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
  getSentMails,
  getReceivedMails,
  getDraftMails,
  getTrashMails,
  getUnreadMails,
  getStarredMails,
  getMailsByLabel,
  setFilter,
  getFilter,
  clearFilter,
  getReadedMails,
  sortMailsByDateDesc,
  sortMailsByDateAsc,
}

const loggedinUser = {
  email: 'user@appsus.com',
  fullname: 'Mahatma Appsus',
}

let filterBy = {
  txt: '',
  status: '',
  isRead: undefined,
  isStarred: undefined,
}

function query(customFilterBy = {}) {
  const activeFilter = { ...filterBy, ...customFilterBy }
  return storageService.query(MAIL_KEY).then((mails) => {
    if (activeFilter.txt) {
      const regExp = new RegExp(activeFilter.txt, 'i')
      mails = mails.filter((mail) => regExp.test(mail.subject) || regExp.test(mail.body))
    }
    if (activeFilter.status) {
      mails = mails.filter((mail) => mail.status === activeFilter.status)
    }
    if (activeFilter.isRead !== undefined) {
      mails = mails.filter((mail) => mail.isRead === activeFilter.isRead && mail.status !== 'trash')
    }
    if (activeFilter.isStarred !== undefined) {
      mails = mails.filter((mail) => mail.isStarred === activeFilter.isStarred && mail.status !== 'trash')
    }
    if (activeFilter.labels) {
      mails = mails.filter((mail) => mail.labels.includes(activeFilter.labels) && mail.status !== 'trash')
    }
    if (activeFilter.to) {
      mails = mails.filter((mail) => mail.to === activeFilter.to)
    }
    if (activeFilter.from) {
      mails = mails.filter((mail) => mail.from === activeFilter.from)
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
    labels: [],
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

function getSentMails() {
  return query({ status: 'sent', from: loggedinUser.email }).then(sortMailsByDateDesc)
}

function getReceivedMails() {
  return query({ status: 'inbox', to: loggedinUser.email }).then(sortMailsByDateDesc)
}

function getDraftMails() {
  return query({ status: 'draft', from: loggedinUser.email }).then(sortMailsByDateDesc)
}

function getTrashMails() {
  return query({ status: 'trash' }).then(sortMailsByDateDesc)
}

function getUnreadMails() {
  return query({ isRead: false, status: 'inbox', to: loggedinUser.email }).then(sortMailsByDateDesc)
}

function getReadedMails() {
  return query({ isRead: true, status: 'inbox', to: loggedinUser.email }).then(sortMailsByDateDesc)
}

function getStarredMails() {
  return query({ isStarred: true, status: 'inbox' }).then(sortMailsByDateDesc)
}

function getMailsByLabel(label) {
  return query({ labels: label, statusNot: 'trash' }).then(sortMailsByDateDesc)
}

function sortMailsByDateDesc(mails) {
  return mails.sort((a, b) => b.createdAt - a.createdAt)
}

function sortMailsByDateAsc(mails) {
  return mails.sort((a, b) => a.createdAt - b.createdAt)
}

function setFilter(newFilter) {
  filterBy = { ...filterBy, ...newFilter }
}

function getFilter() {
  return { ...filterBy }
}

function clearFilter() {
  filterBy = getDefaultFilter()
}
