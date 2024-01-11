const Products = require('../models/productModel');
const Coupon = require('../models/couponModel');


const addProduct = async (req, res) => {
    try {
        // res.json({ status: 'success', message: 'Login API called successfully' });
        res.render('addProduct');
    } catch (error) {
        // res.status(500).json({ status: 'error', message: 'An error occurred' });
        console.log(error.message);
    }
}

//ADD PRODUCTS
const uploadProduct = async (req, res) => {
    try {
        const { productName, skuCode, brand, status, price} = req.body;
        const products = new Products({
            productName: productName,
            skuCode: skuCode,
            brand: brand,
            status: status,
            price: price
        })
        const productSave = await products.save()
        // res.json({ message: 'Product uploaded successfully' })
        res.redirect('/admin/get-all-products')
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Server error' })
    }
}

//GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
    try {
        const products = await Products.find({});
        res.json({ products: products });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

const loadProducts = async (req, res) => {
    try {
        // res.json({ status: 'success', message: 'Login API called successfully' });
        res.render('product');
    } catch (error) {
        // res.status(500).json({ status: 'error', message: 'An error occurred' });
        console.log(error.message);
    }
}

//FILTER PRODUCTS
const getProducts = async (req, res) => {
    try {
        const { skuCode, productName, status } = req.query;
        let query = {};

        if (skuCode) {
            query.skuCode = skuCode;
        }
        if (productName) {
            query.productName = productName;
        }
        if (status) {
            query.status = status;
        }

        const products = await Products.find(query);
        res.json(products);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

const getProductById = async (req, res) => {
    try {
        // Get the product ID from the request parameters
        const { id } = req.params;

        // Find the product by its ID
        const product = await Products.findById(id);

        // If the product was not found, return a 404 error
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Return the product
        res.json(product);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Server error' });
    }
}


const editProduct = async (req, res) => {
    try {
        // res.json({ status: 'success', message: 'Login API called successfully' });
        res.render('updateProduct');
    } catch (error) {
        // res.status(500).json({ status: 'error', message: 'An error occurred' });
        console.log(error.message);
    }
}

//UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const { productName, skuCode, brand, status, discount } = req.body;
        const update = {
            $set: {
                productName: productName,
                skuCode: skuCode,
                brand: brand,
                status: status,
                discount: discount
            }
        };

        const updatedProduct = await Products.findByIdAndUpdate(req.params.id, update, { new: true });
        const updatedProductDiscount=await updatedProduct.save();

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // res.json(updatedProductDiscount);
        res.redirect('/admin/get-all-products')
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

//FOR DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const product = await Products.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
        // res.redirect('/admin/get-all-products');
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

const loadCoupons = async (req, res) => {
    try {
        // res.json({ status: 'success', message: 'Login API called successfully' });
        res.render('coupon');
    } catch (error) {
        // res.status(500).json({ status: 'error', message: 'An error occurred' });
        console.log(error.message);
    }
}

//ADD COUPONS
const uploadCoupon = async (req, res) => {
    try {
        const { code, type, value, minOrder, status, expiryDate, quantity } = req.body
        if (!code.trim() || !type || isNaN(value) || !value || isNaN(minOrder) || !minOrder || !status || !expiryDate.trim()) {
            res.status(400).json({ error: "Check all fields properly", data: req.body })
        } else {
            const coupon = new Coupon({
                code: code,
                type: type,
                value: value,
                minOrder: minOrder,
                status: status,
                expiryDate: expiryDate,
                quantity: quantity
            })
            const couponData = await coupon.save()
            if (couponData) {
                res.status(200).json({ message: "Coupon saved successfully", data: couponData })
            } else {
                res.status(500).json({ error: "Something went wrong, try again", data: req.body })
            }
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message })
    }
}

//GET LIST OF COUPONS
const couponList = async (req, res) => {
    try {
        const couponData = await Coupon.find()
        if (couponData) {
            res.status(200).json({ coupons: couponData })
        } else {
            res.status(404).json({ error: "No coupons found" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message })
    }
}

//GET VALID COUPONS
const getCoupons = async (req, res) => {
    try {
        const currentDate = new Date();
        const validCoupons = await Coupon.find({
            status: 'Active',
            expiryDate: { $gte: currentDate }
        });
        if (validCoupons.length > 0) {
            res.status(200).json({ data: validCoupons });
        } else {
            res.status(404).json({ error: 'No valid coupons found' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    uploadProduct,
    getAllProducts,
    getProducts,
    updateProduct,
    deleteProduct,
    uploadCoupon,
    couponList,
    getCoupons,
    loadProducts,
    addProduct,
    editProduct,
    getProductById,
    loadCoupons
}