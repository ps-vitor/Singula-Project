import singulaLogo from '/images/singula.jpg'
import  styles  from  '../styles/Home.module.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export  default function    home(){
  return (
      <>
        <main className="home">
          <div  className={styles.welcomeText}>
          <h1>
            Bem-vindo(a) ao Singula!
          </h1>
          </div>
          <div  className={styles.aboutText}>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero qui, minus distinctio animi soluta molestias voluptate nulla possimus ratione, commodi, provident non impedit aliquid? Quae nisi inventore unde? Pariatur, ut?
            </p>
          </div>
        </main>
      </>
  )
};
