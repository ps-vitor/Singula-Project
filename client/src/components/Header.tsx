import { useState } from "react";
import { Link } from "react-router-dom";
import singulaLogo from '/images/singula.jpg'
import  styles  from  '../styles/Header.module.css'

export  default function    Header(){
    const[open,setOpen]=useState(false) 

    const toggleMenu=()=>{
      setOpen(prev=>!prev)
    }

    return(
        <header className={styles.header}>
            <Link   to="/">
            <img src={singulaLogo} className={styles.logo} alt="Singula logo" />
            </Link>
            <div    className={styles.menuContainer}>
                <button className={styles.menuButton} onClick={toggleMenu}>☰</button>
                {open && (
                  <ul className={styles.dropdown}>
                    <li><Link to="/">Início</Link></li>
                    <li><Link to="/aulas">Aulas</Link></li>
                    <li><Link to="/artigos">Artigos</Link></li>
                  </ul>
                )}
            </div>
        </header>
    )
}
