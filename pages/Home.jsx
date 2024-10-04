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
      <h2 ref={h1Ref}>Welcome to Appsy by Eliran Zohar & Michael Flaysher</h2>

      {/* Some icons from fontawesome*/}
      <div>
        <i className='fas fa-house'></i>
        <i className='fas fa-cat'></i>
        <i className='fas fa-dog'></i>
      </div>
    </section>
  )
}

// Promise animate css
// function onActivate() {
//   // console.log('h1Ref:', h1Ref)
//   animateCSS(h1Ref.current, 'rubberBand')
//       .then(() => {
//           return animateCSS(imgRef.current, 'bounceOut', false)
//       })
// }
