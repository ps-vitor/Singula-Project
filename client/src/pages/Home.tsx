import singulaLogo from '/images/singula.jpg'
import  styles  from  '../styles/Home.module.css'

export  default function    home(){

    return (
        <>
          <main className="home">
            <button >
            
            </button>
            <div  className={styles.welcomeText}>
            <h1>
              Bem-vindo(a) ao Singula!
            </h1>
            </div>
            <div>
              <a target="_blank">
                <img src={singulaLogo} className={styles.logo} alt="Singula logo" />
              </a>
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
