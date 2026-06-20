import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Vaccine from "@/pages/Vaccine";
import Weight from "@/pages/Weight";
import Feeding from "@/pages/Feeding";
import Medical from "@/pages/Medical";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/vaccine" element={<Vaccine />} />
          <Route path="/weight" element={<Weight />} />
          <Route path="/feeding" element={<Feeding />} />
          <Route path="/medical" element={<Medical />} />
        </Route>
      </Routes>
    </Router>
  );
}
