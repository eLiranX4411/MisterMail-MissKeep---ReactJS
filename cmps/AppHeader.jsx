const { Link, NavLink } = ReactRouterDOM

export function AppHeader() {
  return (
    <header className='app-header'>
      <Link to='/'>
        <img className='appsy-logo' src='../assets/img/Appsy.png' alt='' />
        <h4 className='appsy'>Appsy</h4>
      </Link>
      <nav>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/about'>About</NavLink>
        <NavLink to='/mail'>Mail</NavLink>
        <NavLink to='/note'>Note</NavLink>
      </nav>
    </header>
  )
}
