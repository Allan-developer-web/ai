const Benefits = () => {
  const benefits = [
    ["♧", "Fresh Ingredients", "We use only the freshest local ingredients."],
    ["♕", "Best Chefs", "Our chefs bring years of experience."],
    ["♙", "Fast Delivery", "Get your food delivered at your doorstep."],
  ];

  return (
    <section className="border-t">
      <div className="container-main grid md:grid-cols-3">
        {benefits.map(([icon, title, text]) => (
          <div
            key={title}
            className="py-8 px-6 text-center border-b md:border-b-0 md:border-r last:border-0"
          >
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-bold text-sm">{title}</h3>
            <p className="text-xs text-gray-500 mt-2">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;