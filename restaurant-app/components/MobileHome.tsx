import Link from "next/link";

const MobileHome = () => {
  return (
    <div className="md:hidden">
      <section
        className="h-[520px] bg-cover bg-center text-white p-6 flex items-end"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(0,0,0,.8), rgba(0,0,0,.15)), url('https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80')",
        }}
      >
        <div>
          <p className="text-orange-400 font-bold text-xs">
            Welcome to Foodies
          </p>

          <h1 className="text-3xl font-bold mt-3">
            Good Food
            <br />
            Great Moments
          </h1>

          <p className="text-xs mt-4">
            Fresh ingredients, delicious meals, and a cozy atmosphere.
          </p>

          <Link href="/menu" className="inline-block btn-orange mt-5">
            View Menu
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-3 border-b">
        <div className="text-center p-5 border-r">
          <div className="text-xl">♧</div>
          <b className="text-[10px]">Fresh Ingredients</b>
        </div>

        <div className="text-center p-5 border-r">
          <div className="text-xl">♕</div>
          <b className="text-[10px]">Best Chefs</b>
        </div>

        <div className="text-center p-5">
          <div className="text-xl">♙</div>
          <b className="text-[10px]">Fast Delivery</b>
        </div>
      </section>
    </div>
  );
};

export default MobileHome;