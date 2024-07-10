import express, {Express,Request,Response} from "express";
import{createProduct,getAllProductByCategory,getAllProducts,getProductsByVendor} from '../controllers' 
import{authorizedVendor} from '../controllers/vendorController'
import { aunthenticateToken } from "../middlewares/userMiddleware";
import multer from "multer";
const router = express.Router();


const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString()+ '_' + file.originalname)
  }
})

const images = multer({ storage: imageStorage}).array('images',10)



router.use(aunthenticateToken )

router.route('/').post(authorizedVendor,images,createProduct)
router.route('/:category').get(getAllProductByCategory)
router.route('/').get(getAllProducts)
router.route('/:id').get(getProductsByVendor)

export default router;
