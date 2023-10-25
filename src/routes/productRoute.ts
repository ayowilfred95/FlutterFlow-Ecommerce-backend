import express, {Express,Request,Response} from "express";
import{createProduct,getAllProductByCategory,getAllProducts,getProductsByVendor} from '../controllers/ProductController' 
import{authorizedVendor} from '../controllers/vendorController'
const router = express.Router();

router.route('/').post(authorizedVendor,createProduct)
router.route('/:category').get(getAllProductByCategory)
router.route('/').get(getAllProducts)
router.route('/:id').get(getProductsByVendor)

export default router;
