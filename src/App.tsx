import { Route, Routes } from 'react-router-dom'

import About from '@/components/About'
import Home from '@/components/Home'

export default function App() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
    </div>
  )
}
