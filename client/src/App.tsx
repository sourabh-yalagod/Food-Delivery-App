import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Restaurants from "./pages/Restaurants";

const App = () => {
  return (
    <BrowserRouter>
      <ChatBot />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route element={<AuthRoutes />}>
            <Route path="/cart/:cartId" element={<Cart />} />
          </Route>
        </Route>

        {/* Routes WITHOUT Navbar */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import { Outlet } from "react-router-dom";
import Navbar from "./components/NavBar";
import Cart from "./pages/Cart";
import AuthRoutes from "./lib/AuthRoutes";
import ChatBot from "./components/ChatBot";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

