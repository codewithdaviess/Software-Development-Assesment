import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import TrackedCities from "./pages/TrackedCities";
import Favorites from "./pages/Favorites";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationContainer from "./components/NotificationContainer";

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Navbar />
        <NotificationContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracked-cities" element={<TrackedCities />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
