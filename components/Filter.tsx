"use client";

import React from "react";
import { Box, Select, Input } from "@chakra-ui/react";

interface FilterProps {
  setFilter: (filter: "Available" | "Outofstock" | "All") => void;
  setSearch: (search: string) => void;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
}

const Filter: React.FC<FilterProps> = ({
  setFilter,
  setSearch,
  setMinPrice,
  setMaxPrice,
}) => {
  return (
    <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={4} mb={2} mt={20}>
      <Select
        width="20%" 
        placeholder="Select Option"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setFilter(e.target.value as "Available" | "Outofstock" | "All")
        }
      >
        <option value="Available">Available</option>
        <option value="Outofstock">Out of Stock</option>
        <option value="All">All</option>
      </Select>
      <Input
        width="25%" 
        placeholder="Search"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
      />
      <Input
        width="15%" 
        placeholder="Min Price"
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinPrice(parseInt(e.target.value) || 0)}
      />
      <Input
        width="15%" 
        placeholder="Max Price"
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxPrice(parseInt(e.target.value) || 0)}
      />
    </Box>
  );
};

export default Filter;
