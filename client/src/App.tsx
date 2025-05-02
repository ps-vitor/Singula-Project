import { useEffect } from 'react'
import  {BrowserRouter, Routes, Route}  from  "react-router-dom";
import './App.css'
import  axios from  'axios';
import  Home  from  './pages/Home.tsx';
import  Aulas  from  './pages/aulas.tsx';
import  Artigos  from  './pages/artigos.tsx';
import AulaDetalhe from './pages/aulaDetalhe.tsx';
import Layout from './layout/Layout.tsx';

function App() {
  useEffect(()=>{
    axios.get('https://localhost:5000/api/ping')
      .then(res=>console.log(res.data))
      .catch(err=>console.error(err));
  },[])

  return(
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route  path="/"  element={<Home  />}/>
          <Route  path="/artigos"  element={<Artigos />}/>
          <Route  path="/aulas"  element={<Aulas />}/>
          <Route  path="/aulas/:id"  element={<AulaDetalhe />}/>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App
