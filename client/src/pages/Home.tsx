// ./client/src/pages/Home.tsx

import  styles  from  '../styles/Home.module.css'

export  default function    home(){
  return (
        <main className="home">
          <div  className={styles.welcomeText}>
          <h1>
            Bem-vindo(a) ao Singula!
          </h1>
          </div>
          <div  className={styles.homeText}>
            <h4>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero qui, minus distinctio animi soluta molestias voluptate nulla possimus ratione, commodi, provident non impedit aliquid? Quae nisi inventore unde? Pariatur, ut?
            </h4>
          </div>
        </main>
  )
};