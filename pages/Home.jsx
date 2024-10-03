import { animateCSS } from '../services/util.service.js'

const { useState, useEffect, useRef } = React

export function Home() {
  const h1Ref = useRef()

  function onActivate() {
    animateCSS(h1Ref.current, 'rubberBand')
  }

  return (
    <section className='home'>
      <button onClick={onActivate}>Activate</button>
      <h1 ref={h1Ref}>Welcome to App sus by Eliran Zohar & Michael Flaysher</h1>

      {/* Added icons from fontawesome*/}
      <div>
        <i className='fas fa-house'></i>
        <i className='fas fa-cat'></i>
        <i className='fas fa-dog'></i>
      </div>
    </section>
  )
}
