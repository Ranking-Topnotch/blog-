import React from 'react'
import style from './home.module.css'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className={style.container}>
      <div className={style.section}>
        <p className={style.devHome}>Welcome to <span className={style.homeSpan}>dev_blog</span></p>
        <p className={style.section_head}>
            🚀 Empowering Tech Enthusiasts, One Blog at a Time

            Welcome to dev_blog, the ultimate hub for tech aficionados and innovators. This is where the tech community converges to share their passion, expertise, and cutting-edge insights.
        </p>

        <p className={style.section_p}>
          🔍 Diverse Tech Topics: Immerse yourself in a galaxy of tech wonders! Our contributors span the spectrum of technology, from coding and development to the latest gadgets and beyond.
        </p>

        <p className={style.section_p}>
          🌐 Innovation Central: Stay at the forefront of innovation. Our blog is a dynamic space where groundbreaking ideas and emerging technologies take center stage.
        </p>

        <p className={style.section_p}>
          👩‍💻 Tech Tales: Hear firsthand accounts from tech professionals around the globe. Explore their journeys, learn from their experiences, and be inspired by the ever-evolving tech landscape.
        </p>

      </div>

      <div className={style.imgcon}>
        <img src='https://t3.ftcdn.net/jpg/03/18/60/62/240_F_318606217_Hk8jo2MVoI33SQOkYrfOF929J7JgIP0P.jpg' alt="Homepage" className={style.image} height={350} width={700}/>
        
        <Link className={style.home_link} to={'/login'}>👉 Share Your Tech Odyssey</Link>
        
      </div>
    </div>
  )
}

export default Home