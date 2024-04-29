const express = require('express');
const Routes = express.Router();
const UserController = require('../controllers/User_Controller');
const BlogController = require('../controllers/Blog_Controller');
const MiddlewareAuthentication = require('../middleware/MiddlewareAuthentication');
const SearchController = require('../controllers/Search_Controller');
const BlogReqController = require('../controllers/BlogRequest_Controller')

Routes.post('/Registration', UserController.Registration);

Routes.post('/LogIn', UserController.LogIn);

Routes.get('/FetchActiveUser', MiddlewareAuthentication, UserController.fetchActiveUserData);

Routes.get('/FetchInactiveUser', MiddlewareAuthentication, UserController.fetchInactiveUserData);

Routes.post('/ActiveUser', MiddlewareAuthentication, UserController.AdminActiveUser);

Routes.post('/InactiveUser', MiddlewareAuthentication, UserController.AdminInactiveUser);

Routes.post('/AdminActiveUser', MiddlewareAuthentication, UserController.AdminActiveUser);

Routes.post('/AdminInactiveUser', MiddlewareAuthentication, UserController.AdminInactiveUser);

Routes.post('/PublishBlog', MiddlewareAuthentication, BlogReqController.MakeBlog_Publish);

Routes.post('/RejectBlog', MiddlewareAuthentication, BlogReqController.MakeBlog_Reject);

Routes.post('/AddBlog', MiddlewareAuthentication, BlogController.AddBlog);

Routes.get('/AllBlog', MiddlewareAuthentication, BlogController.fetchAllBlogs);

Routes.post('/ActiveBlog', MiddlewareAuthentication, BlogReqController.MakeBlog_Active);

Routes.get('/AdminActiveBlog', MiddlewareAuthentication, BlogReqController.AdminActiveBlog);

Routes.get('/AdminInactiveBlog', MiddlewareAuthentication, BlogReqController.AdminInactiveBlog);

Routes.post('/InactiveBlog', MiddlewareAuthentication, BlogReqController.MakeBlog_Inactive);

Routes.get('/FetchCategories', BlogController.fetchAllCategories);

Routes.post('/BlogByTitle', MiddlewareAuthentication, BlogController.fetchBlogByTitle);

Routes.get('/PendingBlogs', MiddlewareAuthentication, BlogController.fetchPendingBlogs);

Routes.get('/PublishedBlogs', MiddlewareAuthentication, BlogController.fetchPublishedBlogs);

Routes.get('/RejectedBlogs', MiddlewareAuthentication, BlogController.fetchRejectedBlogs);

Routes.put('/UpdateBlogs', MiddlewareAuthentication, BlogController.updateBlog);

Routes.delete('/DeleteBlogs', MiddlewareAuthentication, BlogController.deleteBlog);

Routes.get('/SearchAllPublishedBlogs', SearchController.SearchAllPublishedBlog);

Routes.post('/SearchFilter', MiddlewareAuthentication, SearchController.SearchFilter);

// Routes.post('/SearchFilter', SearchController.SearchFilter);

module.exports = {
    Routes
};