"use client";
import { useState } from "react";
import DemoShell from "@/components/Layout/DemoShell";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { MdVerifiedUser, MdOutlineMailOutline } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { BiBadgeCheck } from "react-icons/bi";
import { HiOutlineTag, HiOutlineUser } from "react-icons/hi";
import { TbBadgesFilled } from "react-icons/tb";
import { Badge } from "@/components/ui/badge";

// ─── Demo Seller Data ─────────────────────────────────────────────────────────

const SELLER = {
  name: "Kofi Asante Mensah",
  since: 2022,
  avatar: null, // will show initials fallback
  rating: 4.8,
  reviewCount: 42,
  totalListings: 18,
  isVerified: true,
  location: "Accra, Greater Accra",
  email: "k.mensah@example.com",
  phone: "+233 24 000 0001",
  bio: "Trusted seller specialising in electronics, home appliances, and mobile devices. All items are genuine, inspected, and come with a 3-day return guarantee.",
};

const DEMO_REVIEWS = [
  {
    id: 1,
    reviewer: "Ama Boateng",
    rating: 5,
    comment: "Excellent seller! Product was exactly as described. Fast delivery to Kumasi.",
    date: "Mar 2025",
  },
  {
    id: 2,
    reviewer: "Yaw Darko",
    rating: 5,
    comment: "Very honest. iPhone was in perfect condition. Would buy again.",
    date: "Feb 2025",
  },
  {
    id: 3,
    reviewer: "Abena Osei",
    rating: 4,
    comment: "Good experience overall. Minor delay in response but item was great.",
    date: "Jan 2025",
  },
  {
    id: 4,
    reviewer: "Kwame Frimpong",
    rating: 5,
    comment: "Top-tier seller. Packaging was superb and item arrived in mint condition.",
    date: "Dec 2024",
  },
];

const SELLER_ITEMS = [
  {
    id: 1,
    title: 'iPhone 15 Pro 256GB – Space Black',
    price: "GH₵ 12,400",
    location: "Lapaz, Accra",
    isFeatured: true,
    badge: "Featured",
    age: "2 hours ago",
  },
  {
    id: 2,
    title: "Apple MacBook Pro 14\" M3 – 16GB RAM",
    price: "GH₵ 18,500",
    location: "Accra, Greater Accra",
    isFeatured: true,
    badge: "Featured",
    age: "1 day ago",
  },
  {
    id: 3,
    title: "Samsung Galaxy S24 Ultra – 512GB",
    price: "GH₵ 9,200",
    location: "Accra, Greater Accra",
    isFeatured: false,
    badge: null,
    age: "3 days ago",
  },
  {
    id: 4,
    title: "AirPods Pro 2nd Gen – Like New",
    price: "GH₵ 1,850",
    location: "Accra, Greater Accra",
    isFeatured: false,
    badge: null,
    age: "4 days ago",
  },
  {
    id: 5,
    title: "Sony WH-1000XM5 Headphones",
    price: "GH₵ 2,600",
    location: "Accra, Greater Accra",
    isFeatured: false,
    badge: null,
    age: "5 days ago",
  },
  {
    id: 6,
    title: "iPad Air 5th Gen – 64GB Wi-Fi",
    price: "GH₵ 6,700",
    location: "Accra, Greater Accra",
    isFeatured: false,
    badge: null,
    age: "6 days ago",
  },
  {
    id: 7,
    title: "Apple Watch Series 9 – 45mm",
    price: "GH₵ 4,300",
    location: "Accra, Greater Accra",
    isFeatured: false,
    badge: null,
    age: "1 week ago",
  },
  {
    id: 8,
    title: "Logitech MX Master 3S Wireless Mouse",
    price: "GH₵ 780",
    location: "Accra, Greater Accra",
    isFeatured: false,
    badge: null,
    age: "1 week ago",
  },
];

// ─── Star Rating Display ──────────────────────────────────────────────────────

const StarRating = ({ rating, size = 14 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        if (rating >= star)
          return <FaStar key={star} size={size} className="text-yellow-400" />;
        if (rating >= star - 0.5)
          return <FaStarHalfAlt key={star} size={size} className="text-yellow-400" />;
        return <FaRegStar key={star} size={size} className="text-yellow-300" />;
      })}
    </div>
  );
};

// ─── Listing Card ─────────────────────────────────────────────────────────────

const ListingCard = ({ item }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="border rounded-2xl p-2 flex flex-col gap-2 h-full hover:shadow-md transition-shadow">
      <div className="relative bg-muted rounded-xl aspect-square flex items-center justify-center overflow-hidden">
        <HiOutlineTag size={48} className="text-muted-foreground/25" />
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

      <div className="flex flex-col gap-1 px-1 pb-1">
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

// ─── Review Card ─────────────────────────────────────────────────────────────

const ReviewCard = ({ review }) => (
  <div className="border rounded-xl p-4 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
          {review.reviewer.charAt(0)}
        </div>
        <span className="font-semibold text-sm">{review.reviewer}</span>
      </div>
      <span className="text-xs text-muted-foreground">{review.date}</span>
    </div>
    <StarRating rating={review.rating} size={13} />
    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const SellerDemo = () => {
  const [activeTab, setActiveTab] = useState("listings");

  const initials = SELLER.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <DemoShell>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 mt-2">

          {/* ── LEFT: Seller Profile Card ───────────────────────────────── */}
          <aside className="space-y-4">
            <div className="border rounded-2xl overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted">
                <h2 className="font-bold text-base">Seller Info</h2>
                {SELLER.isVerified && (
                  <Badge className="bg-[#FA6E53] text-white flex items-center gap-1 rounded-md px-2 py-0.5 text-xs">
                    <MdVerifiedUser size={14} />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Avatar + Name */}
              <div className="flex flex-col items-center gap-3 p-5 border-t">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-extrabold text-3xl select-none">
                  {initials}
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold">{SELLER.name}</h3>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <StarRating rating={SELLER.rating} />
                    <span className="text-sm text-muted-foreground">
                      {SELLER.rating} · {SELLER.reviewCount} reviews
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Member since {SELLER.since}
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 border-t divide-x">
                <div className="flex flex-col items-center py-3 gap-0.5">
                  <span className="text-xl font-bold text-primary">
                    {SELLER.totalListings}
                  </span>
                  <span className="text-xs text-muted-foreground">Listings</span>
                </div>
                <div className="flex flex-col items-center py-3 gap-0.5">
                  <span className="text-xl font-bold text-primary">
                    {SELLER.reviewCount}
                  </span>
                  <span className="text-xs text-muted-foreground">Reviews</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 px-4 py-3 border-t text-sm text-muted-foreground">
                <GrLocation size={14} />
                <span>{SELLER.location}</span>
              </div>

              {/* Bio */}
              <div className="px-4 pb-4 text-sm text-muted-foreground border-t pt-3">
                {SELLER.bio}
              </div>

              {/* Contact buttons */}
              <div className="flex flex-col gap-2 px-4 pb-4">
                <a
                  href={`tel:${SELLER.phone}`}
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5 bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  <FiPhoneCall size={16} />
                  Call Seller
                </a>
                <a
                  href={`mailto:${SELLER.email}`}
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5 border font-semibold text-sm hover:bg-muted transition-colors"
                >
                  <MdOutlineMailOutline size={16} />
                  Send Message
                </a>
              </div>
            </div>

            {/* Rating Summary Card */}
            <div className="border rounded-2xl p-4">
              <h3 className="font-bold text-sm mb-3">Rating Breakdown</h3>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = star === 5 ? 30 : star === 4 ? 8 : star === 3 ? 3 : star === 2 ? 1 : 0;
                const pct = Math.round((count / SELLER.reviewCount) * 100);
                return (
                  <div key={star} className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs w-3 text-muted-foreground">{star}</span>
                    <FaStar size={11} className="text-yellow-400 shrink-0" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ── RIGHT: Tabs + Content ──────────────────────────────────── */}
          <main>
            {/* Tabs */}
            <div className="flex gap-1 border-b mb-5">
              {["listings", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "listings"
                    ? `Listings (${SELLER_ITEMS.length})`
                    : `Reviews (${DEMO_REVIEWS.length})`}
                </button>
              ))}
            </div>

            {activeTab === "listings" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {SELLER_ITEMS.length} active listings
                  </p>
                  <select className="border rounded-lg text-sm px-3 py-1.5 focus:outline-none">
                    <option>Newest first</option>
                    <option>Oldest first</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {SELLER_ITEMS.map((item) => (
                    <ListingCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}

            {activeTab === "reviews" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DEMO_REVIEWS.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </DemoShell>
  );
};

export default SellerDemo;
