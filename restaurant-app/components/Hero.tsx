import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-amber-50">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2">

        {/* Left side */}
        <div>
          <p className="mb-3 font-semibold uppercase tracking-wider text-orange-600">
            Fresh • Delicious • Made for you
          </p>

          <h1 className="text-4xl font-bold leading-tight text-green-950 sm:text-5xl">
            Good Food, Great Moments.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Enjoy delicious meals prepared with fresh ingredients and
            delivered straight to your table.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/menu"
              className="rounded-lg bg-green-900 px-6 py-3 font-semibold text-white hover:bg-green-800"
            >
              Order Now
            </Link>

            <Link
              href="/menu"
              className="rounded-lg border border-green-900 px-6 py-3 font-semibold text-green-900 hover:bg-green-100"
            >
              View Menu
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="flex min-h-80 items-center justify-center rounded-3xl bg-orange-200">
          <div className="text-8xl">🍔</div>
        </div>

      </div>
    </section>
  );
};

export default Hero;