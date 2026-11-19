const categories = [
  {
    name: "Burgers",
    icon: "🍔",
  },
  {
    name: "Pizza",
    icon: "🍕",
  },
  {
    name: "Pasta",
    icon: "🍝",
  },
  {
    name: "Drinks",
    icon: "🥤",
  },
];

const FoodCategories = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Explore Our Menu
          </h2>

          <p className="mt-3 text-gray-600">
            Choose from our delicious selection
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="text-5xl mb-4">{category.icon}</div>

              <h3 className="text-lg font-semibold text-gray-900">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodCategories;