import singulaLogo from '/images/singula.jpg'

export  default function    home(){

    return (
        <>
          <main>
            <h1>
              Bem-vindo(a) ao Singula!
            </h1>
            <div>
              <a target="_blank">
                <img src={singulaLogo} className="logo" alt="Singula logo" />
              </a>
            </div>
            <div className="card">
              <p>
                Edit <code>src/App.tsx</code> and save to test HMR
              </p>
            </div>
          </main>
        </>
      )
};
