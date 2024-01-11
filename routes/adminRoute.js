const express = require('express');
const admin_route = express();


admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');

const auth = require('../middleware/adminAuth')
const checkLogout = auth.isLogout;
const checkLogin = auth.isLogin;
const multer = require('../config/image')
const upload = multer.upload


const adminController = require('../controllers/adminController');
const bannerController = require('../controllers/bannerController')
const productController = require('../controllers/productController');


admin_route.get('/', adminController.loadDashboard);
admin_route.get('/login', adminController.loadLogin)
admin_route.get('/changePassword', adminController.loadchangepassword)
admin_route.post('/login', adminController.verifyAdmin);
admin_route.post('/changePassword', adminController.changeAdminPassword);
admin_route.post('/logout', adminController.adminLogout);

admin_route.get('/users-list', adminController.loadUsers);

admin_route.get('/banners-list', bannerController.bannerList);
admin_route.post('/add-banner', upload.single('image'), bannerController.uploadBanner);
admin_route.post('/edit-banner', upload.single('image'), bannerController.updateBanner);
admin_route.delete('/delete-banner', bannerController.deleteBanner);

admin_route.post('/add-products', productController.uploadProduct);
admin_route.get('/addProduct', productController.addProduct);
admin_route.get('/getProducts', productController.getAllProducts);
admin_route.get('/get-all-products', productController.loadProducts);
admin_route.get('/getProductById/:id', productController.getProductById);
admin_route.get('/get-products', productController.getProducts);
admin_route.get('/updateProduct/:id', productController.editProduct);
admin_route.post('/update-product/:id', productController.updateProduct);
admin_route.delete('/delete-product/:id', productController.deleteProduct);


admin_route.get('/get-all-coupons', productController.loadCoupons);
admin_route.post('/add-coupons', productController.uploadCoupon);
admin_route.get('/getCouponList', productController.couponList);
admin_route.get('/getValidCoupons', productController.getCoupons);

module.exports = admin_route;