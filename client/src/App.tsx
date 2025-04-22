import { useEffect, useState, } from 'react'
import  {BrowserRouter, Routes, Route}  from  "react-router-dom";
import './App.css'
import  axios from  'axios';
import  Home  from  './pages/Home.tsx';
import  Aulas  from  './pages/Aulas.tsx';
import  Artigos  from  './pages/Artigos.tsx';

function App() {
  const [count, setCount] = useState(0)

  useEffect(()=>{
    axios.get('https://localhost:5000/api/ping')
      .then(res=>console.log(res.data))
      .catch(err=>console.error(err));
  },[])

  return(
    <BrowserRouter>
      <Routes>
        <Route  path="/"  element={<Home  />}/>
        <Route  path="/aulas"  element={<Aulas />}/>
        <Route  path="/artigos"  element={<Artigos />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
