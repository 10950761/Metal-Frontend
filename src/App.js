import { useState } from 'react';
import {  Routes, Route } from 'react-router-dom';
import Home from './topcomponents/Home';
import About  from './topcomponents/About';
import Contact from './topcomponents/Contact';
import SignUp from './pages/SignUp';
import Login from './pages/LogIn';
import Dashboard from './components/Dashboard';
import Explore from './homepagecomponents/Exploretools';
import RecentSales from './transactionalcomponents/RecentSales';
import RecentPurchases from './transactionalcomponents/RecentPurchase';
import Sales from './transactionalcomponents/Sales';
import Purchase from './transactionalcomponents/Purchase';
import Stock from './transactionalcomponents/Stock';
import History from './transactionalcomponents/History';
import PurchaseHistory from './transactionalcomponents/PurchaseHistory';
import SalesHistory from './transactionalcomponents/SaleHistory';


function App() {

  const [, setUser] = useState(null);

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/about" element={<About />} />
        <Route path='/contact' element = {<Contact />} />
       <Route path="/login" element={<Login setUser={setUser}/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path = "/dashboard" element={<Dashboard setUser={setUser} />} >
        <Route path="recent-sales" element={<RecentSales setUser={setUser} />} />
        <Route path="recent-purchases" element={<RecentPurchases setUser={setUser} />} />
        <Route path="sales" element={<Sales setUser={setUser} />} />
        <Route path="purchases" element={<Purchase setUser={setUser} />} />
        <Route path="stock" element={<Stock setUser={setUser} />} />
        <Route path="history" element={<History setUser={setUser} />} />
        <Route path="purchase-history" element={<PurchaseHistory setUser={setUser} />} />
        <Route path="sales-history" element={<SalesHistory setUser={setUser} />} />
      </Route>
      </Routes>
  );
}

export default App;