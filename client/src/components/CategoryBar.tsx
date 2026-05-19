import { useNavigate } from 'react-router-dom';

import { categories } from '../constants/categories';

const CategoryBar = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-orange-500 text-white rounded-xl p-6 mb-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        Categories
      </h2>

      <div className="flex flex-wrap justify-center gap-4">
        {categories.map(category => (
          <button
            key={category.slug}
            onClick={() =>
              navigate(`/category/${category.slug}`)
            }
            className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;