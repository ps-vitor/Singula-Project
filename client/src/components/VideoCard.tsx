// ./client/src/components/Header.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import singulaLogo from '/images/singula.jpg'
import  styles  from  '../styles/Header.module.css'
import  {FaBars}   from    'react-icons/fa';

export  default function    Header(){
    const[open,setOpen]=useState(false)

    const toggleMenu=()=>{
      setOpen(prev=>!prev)
    }

    return(
        <header className={styles.header}>
            <Link   to="/"  onClick={()=>setOpen(false)}>
            <img src={singulaLogo} className={styles.logo} alt="Singula logo" />
            </Link>
            <div    className={styles.menuContainer}>
                <button className={styles.menuButton} onClick={toggleMenu}><FaBars />
                </button>
                {open && (
                  <ul className={styles.dropdown}>
                    <li><Link to="/"  onClick={toggleMenu}>Início</Link></li>
                    <li><Link to="/aulas" onClick={toggleMenu}>Aulas</Link></li>
                    <li><Link to="/artigos" onClick={toggleMenu}>Artigos</Link></li>
                  </ul>
                )}
            </div>
        </header>
    )
}