const { Route, Routes } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

// Main Cmps
import { AppHeader } from './cmps/AppHeader.jsx'
import { NotFound } from './cmps/NotFound.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'

// Pages
import { About } from './pages/About.jsx'
import { Home } from './pages/Home.jsx'

// Apps Pages
import { MailIndex } from './apps/mail/pages/MailIndex.jsx'
import { MailCompose } from './apps/mail/cmps/MailCompose.jsx'
import { MailDetails } from './apps/mail/cmps/MailDetails.jsx'
import { NoteIndex } from './apps/note/pages/NoteIndex.jsx'
import { EditNote } from './apps/note/cmps/EditNote.jsx'

export function App() {
  return (
    <Router>
      <section className='app'>
        <AppHeader />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/mail' element={<MailIndex />} />
          <Route path='/mail/edit/' element={<MailCompose />} />
          <Route path='/mail/details/:mailId' element={<MailCompose />} />
          <Route path='/mail/edit/:mailId' element={<MailCompose />} />
          <Route path='/note' element={<NoteIndex />} />
          <Route path='/note/edit/:noteId' element={<EditNote />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </section>
      <UserMsg />
    </Router>
  )
}
