"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Calendar, MapPin, SearchX, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { Destination } from "@/lib/destinations";

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" },
  { value: "city", label: "City" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
];

const priceOptions = [
  { value: "all", label: "All Prices" },
  { value: "0-1000", label: "$1,000 & Below" },
  { value: "1000-2000", label: "$1,000 - $2,000" },
  { value: "2000-3000", label: "$2,000 - $3,000" },
  { value: "3000", label: "$3,000 & Above" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
];

type Option = { value: string; label: string };

function matchesPrice(range: string, price: number): boolean {
  const [minStr, maxStr] = range.split("-");
  const min = Number(minStr);
  const max = maxStr === undefined ? Infinity : Number(maxStr);
  return price >= min && price < max;
}

function FilterSelect({
  options,
  value,
  placeholder,
  className = "",
  onChange,
}: {
  options: Option[];
  value: string | null;
  placeholder: string;
  className?: string;
  onChange: (value: string | null) => void;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next == null ? null : String(next))}
    >
      <SelectTrigger
        className={`h-14 w-full rounded-none border-[#b6b6b6] bg-white px-6 text-xl uppercase tracking-[0.1px] text-[#6c696d] [&_svg:not([class*='size-'])]:size-5 [&_svg]:text-[#b6b6b6] ${className}`}
      >
        <span className="min-w-0 truncate">
          {selected ? selected.label : placeholder}
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Card className="gap-4 rounded-none bg-white p-0 shadow-none ring-0">
      <div className="relative aspect-[411/231] w-full">
        <Image
          src={destination.imageUrl}
          alt={destination.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <Badge className="absolute right-5 top-5 h-10 gap-1.5 rounded-lg bg-white/60 px-4 text-base font-medium text-[#121212] hover:bg-white/60">
          {destination.rating.toFixed(1)}
          <Star className="size-5 fill-[#1e9e35] text-[#1e9e35]" aria-hidden="true" />
        </Badge>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 shrink-0 text-[#6c696d]" aria-hidden="true" />
          <span className="text-base leading-6 font-medium text-[#6c696d]">
            {destination.country}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-2xl leading-none font-medium tracking-[-0.015em] text-[#0c0b0b]">
            {destination.name}
          </h3>
          <span className="text-2xl leading-none font-medium tracking-[-0.01em] whitespace-nowrap">
            ${destination.price}/Person
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="size-5 shrink-0 text-[#6c696d]" aria-hidden="true" />
          <span className="text-base leading-6 font-medium text-[#6c696d]">
            {destination.duration}
          </span>
        </div>

        <Button
          render={<Link href={`/all-destinations/${destination.id}`} />}
          variant="ghost"
          className="mt-2 h-6 gap-3 self-start rounded-none px-0 text-base font-medium text-brand hover:bg-transparent hover:text-brand"
        >
          BOOK NOW
          <ArrowUpRight className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );
}

export default function DestinationsExplorer({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [sort, setSort] = useState<string | null>(null);

  let results = destinations.filter((destination) => {
    if (category && category !== "all" && destination.category !== category) {
      return false;
    }
    if (priceRange && priceRange !== "all" && !matchesPrice(priceRange, destination.price)) {
      return false;
    }
    return true;
  });

  if (sort === "price-asc") {
    results = [...results].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    results = [...results].sort((a, b) => b.price - a.price);
  } else if (sort === "rating-desc") {
    results = [...results].sort((a, b) => b.rating - a.rating);
  }

  const clearFilters = () => {
    setCategory(null);
    setPriceRange(null);
    setSort(null);
  };

  return (
    <>
      {/* Filters */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1.3fr]">
        <FilterSelect
          options={categoryOptions}
          value={category}
          placeholder="Category"
          onChange={setCategory}
        />
        <FilterSelect
          options={priceOptions}
          value={priceRange}
          placeholder="Price Range"
          className="-mt-px md:mt-0 md:-ml-px"
          onChange={setPriceRange}
        />
        <FilterSelect
          options={sortOptions}
          value={sort}
          placeholder="Sort By"
          className="-mt-px md:mt-0 md:-ml-px"
          onChange={setSort}
        />
      </div>

      {/* Result count */}
      <p className="mt-4 text-xl leading-8 tracking-[-0.03em] text-[#6c696d]">
        Showing {results.length} destinations
      </p>

      {results.length === 0 ? (
        <Empty className="mt-10 border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No destinations found</EmptyTitle>
            <EmptyDescription>
              No travel packages match your current filters. Clear them to see
              every destination again.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((destination, index) => (
            <DestinationCard
              key={`${destination.id}-${index}`}
              destination={destination}
            />
          ))}
        </div>
      )}
    </>
  );
}
