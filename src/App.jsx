import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";

import UserLayout from "./layouts/Userlayout";
import UserDashboard from "./pages/user/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import UserDetails from "./pages/admin/pages/UserDetails";
import ManageTransactions from "./pages/admin/ManageTransactions";
import BuyAirtime from "./pages/user/BuyAirtime";
import BuyData from "./pages/user/BuyData";
import TransactionsPage from "./pages/user/TransactionsPage";
import Profile from "./pages/user/Profile";
import AdminDataPlans from "./pages/admin/pages/AdminDataPlans";

import ElectricityAdmin from "./pages/admin/ElectricityAdmin";
import BuyElectricity from "./pages/user/Electricity";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* User Dashboard */}
        <Route path='/dashboard/*' element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path='buy-airtime' element={<BuyAirtime />} />
          <Route path='buy-data' element={<BuyData />} />
          <Route path='history' element={<TransactionsPage />} />
          <Route path='profile' element={<Profile />} />
          <Route path='electricity' element={<BuyElectricity />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path='/admin/*' element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path='users' element={<ManageUsers />} />
          <Route path='transactions' element={<ManageTransactions />} />
          <Route path='users/:id' element={<UserDetails />} />
          <Route path='services' element={<AdminDataPlans />} />
          <Route path='electricity' element={<ElectricityAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
