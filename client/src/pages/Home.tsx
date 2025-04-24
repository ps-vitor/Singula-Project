import singulaLogo from '/images/singula.jpg'
import  styles  from  './Home.module.css'

export  default function    home(){

    return (
        <>
          <main className="home">
            <button >
            
            </button>
            <h1>
              Bem-vindo(a) ao Singula!
            </h1>
            <div>
              <a target="_blank">
                <img src={singulaLogo} className="logo" alt="Singula logo" />
              </a>
            </div>
            <div className='{styles.lorem}'>
              <p>
                Edit <code>src/App.tsx</code> and save to test HMR
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero qui, minus distinctio animi soluta molestias voluptate nulla possimus ratione, commodi, provident non impedit aliquid? Quae nisi inventore unde? Pariatur, ut?
              </p>
            </div>
          </main>
        </>
      )
};
