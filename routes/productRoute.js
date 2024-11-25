import {Router} from 'express';
import authenticate from '../middlewares/authenticate.js';
import { createProduct, getMyProducts, getProduct, getProducts } from '../controllers/productController.js';
import upload from '../middlewares/multer.js';

const productRoute = Router();

productRoute.get('/', authenticate, getProducts);

productRoute.get('/:id', authenticate, getProduct );

productRoute.get('/myproducts', authenticate, getMyProducts);

productRoute.post('/',  authenticate, upload.single('image'), createProduct);

productRoute.patch('/:id', (req, res) => {
    res.send('update a product');
});

productRoute.delete('/:id', (req, res) => {
    res.send('delete a product');
});

export default productRoute;
