import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import ItemsList from './pages/ItemsList';
import ItemDetail from './pages/ItemDetail';
import CreateItem from './pages/CreateItem';
import MyBids from './pages/MyBids';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { useUserStore } from './store/useUserStore';

function App() {
  const { user } = useUserStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ItemsList />} />
          <Route path="items/:id" element={<ItemDetail />} />
          <Route 
            path="create-item" 
            element={user ? <CreateItem /> : <Navigate to="/login" />} 
          />
          <Route 
            path="my-bids" 
            element={user ? <MyBids /> : <Navigate to="/login" />} 
          />
          <Route 
            path="login" 
            element={!user ? <SignIn /> : <Navigate to="/" />} 
          />
          <Route 
            path="register" 
            element={!user ? <SignUp /> : <Navigate to="/" />} 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
