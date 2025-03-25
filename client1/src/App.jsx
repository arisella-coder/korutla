import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/DashboardLayout";
import Landing from "./pages/Landing";
import Signup from './pages/Signup';
import RootPage from './components/RootPage';
import Home from "./components/bodyComponents/home/Home";
import Inventory from "./components/bodyComponents/inventory/Inventory";

function App() {
  const auth = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={!auth.user ? <Landing /> : <Navigate to="/dashboard/*" />} />
      <Route path="/signup" element={!auth.user ? <Signup /> : <Navigate to="/dashboard/*" />} />
      <Route path="/login" element={!auth.user ? <Login /> : <Navigate to="/dashboard/*" />} />
      <Route path="/dashboard/*" element={auth.user ? <Dashboard /> : <Navigate to="/login" />} >
      <Route index element={<RootPage/>} />
      <Route path="home" element={<Home />} />
      <Route path="inventory" element={<Inventory />}></Route>
      </Route>
      <Route path="*" element={<Navigate to={auth.user ? "/dashboard/*" : "/login"} />} />
    </Routes>
  );
}

export default App;