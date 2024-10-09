import { loadFromStorage, makeId, saveToStorage } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const MAIL_KEY = 'mailsDB'

export const mailService = {
  query,
  queryByFilter,
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
  moveToTrash,
  deletePermanently,
  restoreFromTrash,
  updateReadStatus,
  toggleReadStatus,
  updateStarStatus,
}

const loggedinUser = {
  email: 'user@appsus.com',
  fullname: 'Mahatma Appsus',
}

let filterBy = {
  txt: '',
  isRead: undefined,
  isStarred: undefined,
  isTrash: undefined,
  isDraft: undefined,
}

// פונקציה לשליפת מיילים לפי קטגוריה מסוימת (למשל קבלת מיילים שנשלחו, טיוטות וכו')
function query(customFilterBy = {}) {
  return storageService.query(MAIL_KEY).then((mails) => {
    if (customFilterBy.txt) {
      const regExp = new RegExp(customFilterBy.txt, 'i')
      mails = mails.filter((mail) => regExp.test(mail.subject) || regExp.test(mail.body))
    }
    if (customFilterBy.isRead !== undefined) {
      mails = mails.filter((mail) => mail.isRead === customFilterBy.isRead && !mail.isTrash)
    }
    if (customFilterBy.isStarred !== undefined) {
      mails = mails.filter((mail) => mail.isStarred === customFilterBy.isStarred && !mail.isTrash)
    }
    if (customFilterBy.labels) {
      mails = mails.filter((mail) => mail.labels.includes(customFilterBy.labels) && !mail.isTrash)
    }
    if (customFilterBy.to) {
      mails = mails.filter((mail) => mail.to === customFilterBy.to)
    }
    if (customFilterBy.from) {
      mails = mails.filter((mail) => mail.from === customFilterBy.from)
    }
    if (customFilterBy.isTrash !== undefined) {
      mails = mails.filter((mail) => mail.isTrash === customFilterBy.isTrash)
    }
    if (customFilterBy.isDraft !== undefined) {
      mails = mails.filter((mail) => mail.isDraft === customFilterBy.isDraft)
    }
    return mails
  })
}

// פונקציה לשליפת מיילים לפי אובייקט ה-filterBy השמור, כולל טיפול בערכים null או undefined
function queryByFilter(filterBy = {}) {
  return storageService.query(MAIL_KEY).then((mails) => {
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, 'i')
      mails = mails.filter((mail) => regExp.test(mail.subject) || regExp.test(mail.body))
    }
    if (filterBy.isRead !== undefined) {
      mails = mails.filter((mail) => mail.isRead === filterBy.isRead || filterBy.isRead === null)
    }
    if (filterBy.isStarred !== undefined) {
      mails = mails.filter((mail) => mail.isStarred === filterBy.isStarred || filterBy.isStarred === null)
    }
    if (filterBy.isTrash !== undefined) {
      mails = mails.filter((mail) => mail.isTrash === filterBy.isTrash || filterBy.isTrash === null)
    }
    if (filterBy.labels && filterBy.labels.length) {
      mails = mails.filter((mail) => filterBy.labels.some((label) => mail.labels.includes(label)))
    }
    if (filterBy.startDate) {
      const startDate = new Date(filterBy.startDate).getTime()
      mails = mails.filter((mail) => mail.createdAt >= startDate)
    }
    if (filterBy.endDate) {
      const endDate = new Date(filterBy.endDate).getTime()
      mails = mails.filter((mail) => mail.createdAt <= endDate)
    }
    return mails
  })
}

function toggleReadStatus(mailId) {
  return storageService.get(MAIL_KEY, mailId).then((mail) => {
    mail.isRead = !mail.isRead
    return storageService.put(MAIL_KEY, mail)
  })
}

function updateStarStatus(mailId) {
  return storageService.get(MAIL_KEY, mailId).then((mail) => {
    mail.isStarred = !mail.isStarred
    return storageService.put(MAIL_KEY, mail)
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

function moveToTrash(mailId) {
  return storageService.get(MAIL_KEY, mailId).then((mail) => {
    if (!mail.isTrash) {
      mail.isTrash = true
      return storageService.put(MAIL_KEY, mail)
    } else {
      return deletePermanently(mailId)
    }
  })
}

function deletePermanently(mailId) {
  return storageService.remove(MAIL_KEY, mailId)
}

function restoreFromTrash(mailId) {
  return storageService.get(MAIL_KEY, mailId).then((mail) => {
    if (mail.isTrash) {
      mail.isTrash = false
      return storageService.put(MAIL_KEY, mail)
    }
  })
}

function updateReadStatus(mailId, isRead) {
  return storageService.get(MAIL_KEY, mailId).then((mail) => {
    mail.isRead = isRead
    mail.readAt = isRead ? Date.now() : null
    return storageService.put(MAIL_KEY, mail)
  })
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
    isDraft: true,
    isRead: false,
    readAt: null,
    removedAt: null,
    isStarred: false,
    labels: [],
    isTrash: false,
  }
}

function getDefaultFilter() {
  return {
    txt: '',
    isRead: undefined,
    isStarred: undefined,
    isDraft: undefined,
    isTrash: undefined,
  }
}

function getFilterFromSearchParams(searchParams) {
  const txt = searchParams.get('txt') || ''
  const isRead = searchParams.get('isRead') ? searchParams.get('isRead') === 'true' : undefined
  const isStarred = searchParams.get('isStarred') ? searchParams.get('isStarred') === 'true' : undefined
  const isDraft = searchParams.get('isDraft') ? searchParams.get('isDraft') === 'true' : undefined
  const isTrash = searchParams.get('isTrash') ? searchParams.get('isTrash') === 'true' : undefined
  return {
    txt,
    isRead,
    isStarred,
    isDraft,
    isTrash,
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
  return query({ isDraft: false, isTrash: false, from: loggedinUser.email }).then(sortMailsByDateDesc)
}

function getReceivedMails() {
  return query({ isDraft: false, isTrash: false, to: loggedinUser.email }).then(sortMailsByDateDesc)
}

function getDraftMails() {
  return query({ isDraft: true, from: loggedinUser.email }).then(sortMailsByDateDesc)
}

function getTrashMails() {
  return query({ isTrash: true }).then(sortMailsByDateDesc)
}

function getUnreadMails() {
  return query({ isRead: false, isDraft: false, isTrash: false, to: loggedinUser.email }).then(sortMailsByDateDesc)
}

function getReadedMails() {
  return query({ isRead: true, isDraft: false, isTrash: false, to: loggedinUser.email }).then(sortMailsByDateDesc)
}

function getStarredMails() {
  return query({ isStarred: true, isTrash: false }).then(sortMailsByDateDesc)
}

function getMailsByLabel(label) {
  return query({ labels: label, isTrash: false }).then(sortMailsByDateDesc)
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
