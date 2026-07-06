import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import Swal from 'sweetalert2';

const SearchPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Extract filtering parameters for display title
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category');
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        if (!user) {
            Swal.fire({ title: 'Authentication Required', text: 'Please sign in before adding items to the cart.', icon: 'warning', confirmButtonColor: '#3B6E1A' });
            navigate('/login');
            return;
        }
        addToCart(product, 1);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/products${location.search}`);
                const actualProducts = data.filter(p => p.name !== 'Sample name');
                setProducts(actualProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [location.search]);

    const getTitle = () => {
        if (category) return `Category: ${category}`;
        if (keyword) return `Search Results for "£{keyword}"`;
        return 'All Products';
    };

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-[#2E2E2E]">{getTitle()}</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ADEF]"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-semibold text-gray-600">No products found.</h2>
                        <p className="text-gray-500 mt-2">Try adjusting your search or category.</p>
                        <Link to="/" className="inline-block mt-6 bg-[#00ADEF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0092ca] transition">
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm flex flex-col group hover:-translate-y-1 hover:shadow-md hover:border-[#3B6E1A]/30 transition-all duration-300">
                                <Link to={`/product/${product._id}`} className="block relative aspect-square p-3 bg-white border-b border-gray-50">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-300" />
                                </Link>
                                <div className="p-3 md:p-4 flex flex-col flex-grow text-left">
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-gray-800 text-sm md:text-base leading-tight mb-1 line-clamp-2">
                                            <Link to={`/product/${product._id}`}>{product.name}</Link>
                                        </h3>
                                        <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">{product.brand}</p>
                                    </div>
                                    <div className="mt-3 flex justify-between items-center">
                                        <span className="font-black text-lg md:text-xl text-[#3B6E1A]">£{product.price.toFixed(2)}</span>
                                        {product.countInStock > 0 ? (
                                            <button onClick={(e) => handleAddToCart(e, product)} className="bg-[#D91C2A] text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-xl border-2 border-transparent hover:scale-105 active:scale-95 transition-all shadow-sm">
                                                +
                                            </button>
                                        ) : (
                                            <span className="text-xs font-bold text-red-500 uppercase">Out of Stock</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
