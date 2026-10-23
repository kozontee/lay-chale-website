
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Reservation from "./pages/Reservation.jsx";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
