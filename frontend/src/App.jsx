import { useState,useEffect} from 'react'
import {HashRouter as Router,Routes,Route} from 'react-router-dom'
import {Landing} from './pages/Landing'
import {Home} from './pages/Home'
import {ViewClient} from './pages/ViewClient'
import {CreateClient} from './pages/CreateClient'
import {Materials} from './pages/Materials'
import {ViewMaterial} from './pages/ViewMaterial'
import {CreateMaterial} from './pages/CreateMaterial'
import {EditClient} from './pages/EditClient'
import {EditMaterial} from './pages/EditMaterial'
import {Rents} from './pages/Rents'
import {CreateRent} from './pages/CreateRent'
import {EditRent} from './pages/EditRent'
import {ViewClientRents} from './pages/ViewClientRents'
import {Navbar} from './components/Navbar'  
import {Layout} from './components/Layout'
import './App.css'
import axios from 'axios'

function App() {

  useEffect(() => {
    let token = localStorage.getItem("token")
    if(token){
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
  },[])

  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Landing/>}/>
        <Route  element = {<Layout/>}>
          <Route path = "/home" element = {<Home/>}/>
          <Route path = "/viewclient/:id" element = {<ViewClient/>}/>
          <Route path = "/createclient" element = {<CreateClient/>}/>
          <Route path = "/editclient/:id" element = {<EditClient/>}/>
          <Route path = "/materials" element = {<Materials/>}/>
          <Route path = "/viewmaterial/:id" element = {<ViewMaterial/>}/>
          <Route path = "/creatematerial" element = {<CreateMaterial/>}/>
          <Route path = "/editmaterial/:id" element = {<EditMaterial/>}/>
          <Route path = "/rents" element = {<Rents/>}/>
          <Route path = "/createrent" element = {<CreateRent/>}/>
          <Route path = "/editrent/:id" element = {<EditRent/>}/>
          <Route path = "/clientrents/:clientId" element = {<ViewClientRents/>}/>
        </Route>
      </Routes>
    </Router >
  )
}

export default App
