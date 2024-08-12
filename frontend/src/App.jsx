import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/index";
import Admin from "./admin";
import Login from "./login";
import Signup from "./signup";

function App() {
  return (
    <div className=" min-h-svh flex justify-center bg-background text-primary">
      <Router>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
