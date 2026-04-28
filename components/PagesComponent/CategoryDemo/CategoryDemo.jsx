"use client";
import { useState } from "react";
import DemoShell from "@/components/Layout/DemoShell";
import CustomLink from "@/components/Common/CustomLink";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { MdComputer, MdDirectionsCar, MdHome, MdOutlineFastfood } from "react-icons/md";
import { IoShirtOutline } from "react-icons/io5";
import { LuDumbbell, LuBookOpen, LuSofa } from "react-icons/lu";
import { HiOutlineTag } from "react-icons/hi";
import { BiBadgeCheck } from "react-icons/bi";
import { GrLocation } from "react-icons/gr";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 1,
    slug: "electronics",
    name: "Electronics",
    count: 245,
    icon: <MdComputer size={30} />,
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
  },
  {
    id: 2,
    slug: "vehicles",
    name: "Vehicles",
    count: 189,
    icon: <MdDirectionsCar size={30} />,
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100",
  },
  {
    id: 3,
    slug: "real-estate",
    name: "Real Estate",
    count: 312,
    icon: <MdHome size={30} />,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
  {
    id: 4,
    slug: "fashion",
    name: "Fashion",
    count: 156,
    icon: <IoShirtOutline size={28} />,
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100",
  },
  {
    id: 5,
    slug: "sports",
    name: "Sports & Fitness",
    count: 93,
    icon: <LuDumbbell size={28} />,
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
  },
  {
    id: 6,
    slug: "furniture",
    name: "Furniture",
    count: 127,
    icon: <LuSofa size={28} />,
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    border: "border-yellow-100",
  },
  {
    id: 7,
    slug: "books",
    name: "Books & Education",
    count: 64,
    icon: <LuBookOpen size={28} />,
    bg: "bg-pink-50",
    text: "text-pink-600",
    border: "border-pink-100",
  },
  {
    id: 8,
    slug: "food-drinks",
    name: "Food & Beverages",
    count: 78,
    icon: <MdOutlineFastfood size={28} />,
    bg: "bg-teal-50",
    text: "text-teal-600",
    border: "border-teal-100",
  },
];

const DEMO_ITEMS = [
  {
    id: 1,
    slug: "electronics",
    title: "Apple MacBook Pro 14\" M3 Chip",
    price: "GH₵ 18,500",
    category: "Electronics",
    location: "Accra, Greater Accra",
    isFeatured: true,
    isVerified: true,
    badge: "Featured",
    age: "2 days ago",
  },
  {
    id: 2,
    slug: "vehicles",
    title: "Toyota Corolla 2021 – Low Mileage",
    price: "GH₵ 92,000",
    category: "Vehicles",
    location: "Kumasi, Ashanti",
    isFeatured: true,
    isVerified: true,
    badge: "Featured",
    age: "5 hours ago",
  },
  {
    id: 3,
    slug: "real-estate",
    title: "Luxury 3-Bedroom Apartment for Rent",
    price: "GH₵ 4,200 / mo",
    category: "Real Estate",
    location: "East Legon, Accra",
    isFeatured: false,
    isVerified: false,
    badge: null,
    age: "1 day ago",
  },
  {
    id: 4,
    slug: "electronics",
    title: "Samsung 65\" 4K QLED Smart TV",
    price: "GH₵ 9,800",
    category: "Electronics",
    location: "Tema, Greater Accra",
    isFeatured: false,
    isVerified: false,
    badge: null,
    age: "3 days ago",
  },
  {
    id: 5,
    slug: "fashion",
    title: "Nike Air Max 270 – Size 42",
    price: "GH₵ 650",
    category: "Fashion",
    location: "Madina, Accra",
    isFeatured: false,
    isVerified: true,
    badge: null,
    age: "12 hours ago",
  },
  {
    id: 6,
    slug: "vehicles",
    title: "Honda CB500F Motorcycle 2022",
    price: "GH₵ 34,000",
    category: "Vehicles",
    location: "Takoradi, Western",
    isFeatured: true,
    isVerified: false,
    badge: "Featured",
    age: "6 days ago",
  },
  {
    id: 7,
    slug: "furniture",
    title: "L-Shape Corner Sofa – Cream",
    price: "GH₵ 2,500",
    category: "Furniture",
    location: "Spintex, Accra",
    isFeatured: false,
    isVerified: true,
    badge: null,
    age: "4 days ago",
  },
  {
    id: 8,
    slug: "sports",
    title: "Professional Gym Equipment Set",
    price: "GH₵ 5,700",
    category: "Sports & Fitness",
    location: "Osu, Accra",
    isFeatured: false,
    isVerified: false,
    badge: null,
    age: "1 week ago",
  },
  {
    id: 9,
    slug: "real-estate",
    title: "Commercial Office Space 120m²",
    price: "GH₵ 8,500 / mo",
    category: "Real Estate",
    location: "Airport City, Accra",
    isFeatured: true,
    isVerified: true,
    badge: "Featured",
    age: "9 hours ago",
  },
  {
    id: 10,
    slug: "electronics",
    title: "iPhone 15 Pro 256GB – Space Black",
    price: "GH₵ 12,400",
    category: "Electronics",
    location: "Lapaz, Accra",
    isFeatured: false,
    isVerified: true,
    badge: null,
    age: "2 hours ago",
  },
  {
    id: 11,
    slug: "books",
    title: "WASSCE Past Questions Bundle (10 yrs)",
    price: "GH₵ 120",
    category: "Books & Education",
    location: "Accra Central",
    isFeatured: false,
    isVerified: false,
    badge: null,
    age: "5 days ago",
  },
  {
    id: 12,
    slug: "food-drinks",
    title: "Home-Made Sobolo (Hibiscus Juice) – 5L",
    price: "GH₵ 85",
    category: "Food & Beverages",
    location: "Achimota, Accra",
    isFeatured: false,
    isVerified: false,
    badge: null,
    age: "Just now",
  },
];

// ─── Item Card ────────────────────────────────────────────────────────────────

const DemoItemCard = ({ item }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="border rounded-2xl p-2 flex flex-col gap-2 h-full hover:shadow-md transition-shadow">
      {/* Image placeholder */}
      <div className="relative bg-muted rounded-xl aspect-square flex items-center justify-center overflow-hidden">
        <HiOutlineTag size={48} className="text-muted-foreground/30" />
        {item.badge && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded">
            {item.badge}
          </span>
        )}
        <button
          onClick={() => setLiked((p) => !p)}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow"
          aria-label="Favourite"
        >
          {liked ? (
            <FaHeart size={14} className="text-red-500" />
          ) : (
            <FaRegHeart size={14} className="text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1 px-1 pb-1">
        {item.isVerified && (
          <div className="flex items-center gap-1 text-xs text-primary">
            <BiBadgeCheck size={14} />
            <span>Verified</span>
          </div>
        )}
        <p className="text-sm font-semibold line-clamp-2 leading-snug">
          {item.title}
        </p>
        <p className="text-base font-bold text-primary">{item.price}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
          <GrLocation size={11} />
          <span className="truncate">{item.location}</span>
          <span className="ltr:ml-auto rtl:mr-auto shrink-0">{item.age}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const CategoryDemo = () => {
  const [activeSlug, setActiveSlug] = useState(null);
  const [search, setSearch] = useState("");

  const activeCat = CATEGORIES.find((c) => c.slug === activeSlug);

  const visibleItems = activeSlug
    ? DEMO_ITEMS.filter((i) => i.slug === activeSlug)
    : DEMO_ITEMS;

  const searchedItems = search
    ? visibleItems.filter((i) =>
        i.title.toLowerCase().includes(search.toLowerCase())
      )
    : visibleItems;

  return (
    <DemoShell>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* ── Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {activeCat ? activeCat.name : "Browse Categories"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {activeCat
              ? `${activeCat.count} listings in ${activeCat.name}`
              : "Find what you need across all categories"}
          </p>
        </div>

        {/* ── Category Grid */}
        <section className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setActiveSlug((prev) => (prev === cat.slug ? null : cat.slug))
                }
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all
                  ${activeSlug === cat.slug
                    ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                    : `${cat.bg} ${cat.border} hover:shadow-sm`
                  }`}
              >
                <div
                  className={`p-2.5 rounded-full ${
                    activeSlug === cat.slug ? "bg-primary/10 text-primary" : `${cat.bg} ${cat.text}`
                  }`}
                >
                  {cat.icon}
                </div>
                <span className="text-xs font-semibold text-center leading-tight line-clamp-2">
                  {cat.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium bg-white/70 px-1.5 py-0.5 rounded-full">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Listings Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <h2 className="text-lg font-bold flex-1">
              {activeCat ? `${activeCat.name} Listings` : "All Listings"}
              <span className="ml-2 text-sm text-muted-foreground font-normal">
                ({searchedItems.length} results)
              </span>
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search listings…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {activeSlug && (
                <button
                  onClick={() => setActiveSlug(null)}
                  className="text-xs text-muted-foreground underline whitespace-nowrap"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>

          {searchedItems.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <HiOutlineTag size={40} className="mx-auto mb-3 opacity-30" />
              <p>No listings found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {searchedItems.map((item) => (
                <DemoItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </DemoShell>
  );
};

export default CategoryDemo;
