import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import DocScreen from "./screens/Doc"
import Home from "./screens/Home"

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Home />} />
				<Route path='/doc' element={<DocScreen />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
