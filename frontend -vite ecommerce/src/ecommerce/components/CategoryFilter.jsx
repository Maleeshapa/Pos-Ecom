// import React, { useState } from 'react';
// import { Button } from 'react-bootstrap';
// import { categories } from '../data/categories';

// function CategoryFilter({ activeCategory, setActiveCategory }) {
//   return (
//     <>
//       <h5 className="mb-3">Categories</h5>
//       <div className="categories-container mb-4">
//         <Button 
//           variant={activeCategory === 'all' ? 'dark' : 'light'} 
//           className="category-btn me-2 mb-2"
//           onClick={() => setActiveCategory('all')}
//         >
//           All
//         </Button>
//         {categories.map(category => (
//           <Button 
//             key={category.id}
//             variant={activeCategory === category.name ? 'dark' : 'light'} 
//             className="category-btn me-2 mb-2"
//             onClick={() => setActiveCategory(category.name)}
//           >
//             <span className="me-1">{category.icon}</span>
//             {category.name}
//           </Button>
//         ))}
//       </div>
//     </>
//   );
// }

// export default CategoryFilter;