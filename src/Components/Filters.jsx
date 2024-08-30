import React, { useMemo } from 'react';

const Filters = ({ brands, filters, handleFilter }) => {
    const categories = useMemo(() => [
        "beauty",
        "fragrances",
        "furniture",
        "groceries",
        "home-decoration",
        "kitchen-accessories",
        "laptops",
        "mens-shirts",
        "mens-shoes",
        "mens-watches",
        "mobile-accessories",
        "motorcycle",
        "skin-care",
        "smartphones",
        "sports-accessories",
        "sunglasses",
        "tablets",
        "tops",
        "vehicle",
        "womens-bags",
        "womens-dresses",
        "womens-jewellery",
        "womens-shoes",
        "womens-watches"
    ]);
    return (
        <div className='filter-container'>
            <select onChange={(e) => handleFilter('category', e.target.value)} value={filters.category}>
                <option value="">All Categories</option>
                {categories.map(category => <option value={category}>{category}</option>)}
            </select>

            <select onChange={(e) => handleFilter('brand', e.target.value)} value={filters.brand}>
                <option value="">All Brands</option>
                {brands.map((brand) => <option value={brand}>{brand}</option>)}
            </select>
            <div>            <p>Selected Price Range: {filters.priceRange[1]}</p>

                <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilter('priceRange', [0, e.target.value])}
                />
</div>
        </div>
    );
};

export default Filters;
