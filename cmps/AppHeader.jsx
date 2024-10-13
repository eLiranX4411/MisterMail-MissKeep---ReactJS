const { Link, NavLink, useLocation } = ReactRouterDOM

export function AppHeader() {
  const { useState, useEffect, useRef } = React
  const location = useLocation()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const toggleSettingsMenu = () => {
    setIsSettingsOpen((prev) => !prev)
  }

  const NoteHeader = () => (
    <header className='note-app-header'>
      <div className='note-header-left'>
        <img className='keep-logo' src='../../../apps/note/img/missKeep.png' alt='Google Keep Logo' />
        <h1>Miss Notes</h1>
      </div>

      <div className='note-header-right'>
        {/* Settings Icon with Dropdown */}
        <button className='note-settings-btn' onClick={toggleSettingsMenu}>
          ⚙️
        </button>

        {/* Dropdown Menu */}
        {isSettingsOpen && (
          <ul className='settings-dropdown'>
            <li>
              <Link to='/'>🏠 Home</Link>
            </li>
          </ul>
        )}
      </div>
    </header>
  )

  const MailHeader = () => (
    <header className='mail-app-header'>
      <div className='mail-header-left'>
        <img className='mail-logo' src='../../../apps/mail/img/misterMail.png' alt='Gmail Logo' />
        <h2>Mister Mail</h2>
      </div>

      <div className='mail-header-right'>
        {/* Settings Icon with Dropdown */}
        <button className='mail-settings-btn' onClick={toggleSettingsMenu}>
          ⚙️
        </button>

        {/* Dropdown Menu */}
        {isSettingsOpen && (
          <ul className='settings-dropdown'>
            <li>
              <Link to='/'>🏠 Home</Link>
            </li>
          </ul>
        )}
      </div>
    </header>
  )

  const DefaultHeader = () => (
    <header className='app-header'>
      <h1 className='app-title'>Appsy App</h1>

      <nav className='nav-desktop'>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/about'>About</NavLink>
        <NavLink to='/mail'>Mail</NavLink>
        <NavLink to='/note'>Note</NavLink>
      </nav>

      {/* Hamburger Menu Icon */}
      <div className='hamburger-menu' onClick={toggleMenu}>
        <div className='line'></div>
        <div className='line'></div>
        <div className='line'></div>
      </div>

      {/* Mobile Navigation Menu */}
      <nav className={`nav-mobile ${isMenuOpen ? 'show' : ''}`}>
        <NavLink to='/' onClick={toggleMenu}>
          Home
        </NavLink>
        <NavLink to='/about' onClick={toggleMenu}>
          About
        </NavLink>
        <NavLink to='/mail' onClick={toggleMenu}>
          Mail
        </NavLink>
        <NavLink to='/note' onClick={toggleMenu}>
          Note
        </NavLink>
      </nav>
    </header>
  )

  // Conditionally render the Google Keep-style header if at /note, else render the default header
  if (location.pathname === '/note') {
    return <NoteHeader />
  } else if (location.pathname === '/mail') {
    return <MailHeader />
  } else {
    return <DefaultHeader />
  }
}
