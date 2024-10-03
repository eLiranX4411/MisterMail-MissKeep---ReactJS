const { Route, Routes } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

// Main Cmps
import { AppHeader } from './cmps/AppHeader.jsx'
import { NotFound } from './cmps/NotFound.jsx'

// Pages
import { About } from './pages/About.jsx'
import { Home } from './pages/Home.jsx'

// Apps Cmps
import { MailIndex } from './apps/mail/pages/MailIndex.jsx'
import { NoteIndex } from './apps/note/pages/NoteIndex.jsx'

export function App() {
  return (
    <Router>
      <section className='app'>
        <AppHeader />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/mail' element={<MailIndex />} />
          <Route path='/note' element={<NoteIndex />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </section>
    </Router>
  )
}
