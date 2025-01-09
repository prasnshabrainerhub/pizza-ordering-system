import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 h-[600px]">
        <div className="absolute inset-0">
          <img
            src="/api/placeholder/1920/600"
            alt="Pizza hero"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Delicious Pizza,<br />
              Delivered Hot & Fresh
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl">
              Handcrafted with love using the finest ingredients. 
              Customize your perfect pizza and get it delivered to your doorstep.
            </p>
            <div className="space-x-4">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700"
                asChild
              >
                <Link href="/menu">Order Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-gray-900"
                asChild
              >
                <Link href="/menu">View Menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Special Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/menu?category=${category.id}`}
                className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={`/api/placeholder/400/300`}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-200">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 text-red-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const categories = [
  {
    id: "classic",
    name: "Classic Pizzas",
    description: "Timeless favorites that never go out of style"
  },
  {
    id: "specialty",
    name: "Specialty Pizzas",
    description: "Unique combinations for adventurous tastes"
  },
  {
    id: "vegetarian",
    name: "Vegetarian",
    description: "Fresh and flavorful meat-free options"
  },
  {
    id: "custom",
    name: "Build Your Own",
    description: "Create your perfect pizza from scratch"
  }
]

const features = [
  {
    title: "Fresh Ingredients",
    description: "We use only the freshest, highest-quality ingredients in every pizza",
    icon: <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
  },
  {
    title: "Fast Delivery",
    description: "Hot and fresh pizza delivered to your door in 30 minutes or less",
    icon: <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  },
  {
    title: "Custom Orders",
    description: "Create your perfect pizza with our wide selection of toppings",
    icon: <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
  }
]
</antArtifact