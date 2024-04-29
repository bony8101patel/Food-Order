// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import LogIn from './components/LogIn/LogIn';
import Registration from './components/Registration/Registration';
import { AddBlog } from './components/AddBlog/AddBlog';
import { ToastContainer } from 'react-bootstrap';
import BlogRequest from './components/BlogRequest/BlogRequest';
import BlogRejected from './components/BlogRejected/BlogRejected';
import PublishedBlog from './components/PublishedBlog/PublishedBlog';
import ActiveUser from './components/ActiveUser/ActiveUser';
import InactiveUser from './components/InactiveUser/InactiveUser';
import AdminBlogRequest from './components/AdminBlogRequest/AdminBlogRequest';
import AdminBlogReject from './components/AdminBlogRejected/AdminBlogRejected';
import PublishedBlogUser from './components/PublishedBlogUser/PublishedBlogUser';
import AdminPublishedBlog from './components/AdminPublishedBlog/AdminPublishedBlog';


function App() {
  return (
    <div className="App">
      <Header />
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PublishedBlog />} />
          <Route path="/LogIn" element={<LogIn />} />
          <Route path="/Registration" element={<Registration />} />


          <Route path='/User/PublishedBlog' element={<PublishedBlogUser />} />
          <Route path='/User/AddBlog' element={<AddBlog />} />
          <Route path='/User/BlogRequest' element={<BlogRequest />} />
          <Route path='/User/BlogRejected' element={<BlogRejected />} />
          
          <Route path='/Admin/BlogRequest' element={<AdminBlogRequest/>} />
          <Route path='/Admin/BlogReject' element={<AdminBlogReject />} />
          <Route path='/Admin/PublishedBlog' element={<AdminPublishedBlog />} />
          
          <Route path='/ActiveUser' element={<ActiveUser />} />
          <Route path='/InactiveUser' element={<InactiveUser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
