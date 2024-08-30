import { useEffect, useState } from 'react';
import Filters from '../Components/Filters';
import Pagination from '../Components/Pagination';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ category: '', brand: '', priceRange: [0, 1000] });
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(6);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://dummyjson.com/products');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setProducts(jsonData.products);
                setFilteredProducts(jsonData.products);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [filters]);

    useEffect(() => {
        let tempProducts = products;

        if (debouncedSearchTerm) {
            tempProducts = tempProducts.filter(product => 
                 product.title && debouncedSearchTerm && product.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))        }

        if (debouncedFilters.category) {
            tempProducts = tempProducts.filter(product => product.category === debouncedFilters.category);
        }

        if (debouncedFilters.brand) {
            tempProducts = tempProducts.filter(product => product.brand === debouncedFilters.brand);
        }

        if (debouncedFilters.priceRange) {
            tempProducts = tempProducts.filter(product =>
                product.price >= debouncedFilters.priceRange[0] &&
                product.price <= debouncedFilters.priceRange[1]
            );
        }

        setFilteredProducts(tempProducts);
    }, [debouncedSearchTerm, debouncedFilters, products]);

    const handleFilter = (filterType, value) => {
        setFilters((prev) => ({ ...prev, [filterType]: value }));
    };

    const handleProductsPerPageChange = (event) => {
        setProductsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container">
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="searchBar"
            />
            <Filters brands={products.filter(product => product.brand).map((product)=>product.brand)} filters={filters} handleFilter={handleFilter} />

            <div className="productsPerPage">
                <label htmlFor="productsPerPage">Products per page:</label>
                <select id="productsPerPage" value={productsPerPage} onChange={handleProductsPerPageChange}>
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                </select>
            </div>

            <div className="productGrid">
                {currentProducts.map(product => (
                    <div key={product.id} className="productCard">
                        <img src={product.thumbnail} alt={product.title} className="productImage" />
                        <h3 className="productName">{product.title}</h3>
                        <p>{product.description}</p>
                        <p className="productPrice">${product.price}</p>
                    </div>
                ))}
            </div>

            <Pagination
                productsPerPage={productsPerPage}
                totalProducts={filteredProducts.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div>
    );
};

export default Home;
