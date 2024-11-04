"use client";

import { useState } from 'react';
import { Card, CardContent } from "./card";
import { Checkbox } from "./checkbox";
import { Slider } from "./slider";
import { Filter } from "lucide-react";

interface FilterProps {
  categories: string[];
  selectedCategories: string[];
  brands: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  showInStock: boolean;
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onShowInStockChange: (value: boolean) => void;
}

export function ProductFilters({
  categories,
  selectedCategories,
  brands,
  selectedBrands,
  priceRange,
  showInStock,
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
  onShowInStockChange,
}: FilterProps) {
  // Estado para manejar la visibilidad de los filtros en móviles
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  return (
    <>
      {/* Botón de icono para abrir filtros en móviles */}
      <button
        className="md:hidden p-2 bg-gray-200 rounded-full flex items-center"
        onClick={() => setIsFilterVisible(!isFilterVisible)}
      >
        <Filter className="w-6 h-6 text-gray-700" />
        <span className="ml-2 text-gray-700">Filtros</span>
      </button>

      {/* Filtros: Ocultos en pantallas pequeñas y visibles en pantallas grandes */}
      <div
        className={`${
          isFilterVisible ? 'block' : 'hidden'
        } md:block fixed inset-0 z-50 bg-white md:relative md:z-auto md:bg-transparent overflow-y-auto md:h-auto p-4 md:p-0 md:w-auto md:static shadow-lg md:shadow-none`}
      >
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Filter className="mr-2" /> Filtros
            </h2>
            <div className="space-y-4">
              {/* Categorías */}
              <div>
                <h3 className="font-medium mb-2">Categorías</h3>
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => onCategoryChange(category)}
                    />
                    <label
                      htmlFor={category}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>

              {/* Marcas */}
              <div>
                <h3 className="font-medium mb-2">Marcas</h3>
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => onBrandChange(brand)}
                    />
                    <label
                      htmlFor={brand}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>

              {/* Rango de Precio */}
              <div>
                <h3 className="font-medium mb-2">Rango de Precio</h3>
                <Slider
                  min={0}
                  max={100000}
                  step={1}
                  value={priceRange}
                  onValueChange={(value: number[]) =>
                    onPriceRangeChange([Math.min(...value), Math.max(...value)] as [number, number])
                  }
                  className="mb-2"
                />
                <div className="flex justify-between text-sm">
                  <span>${priceRange[0].toFixed(2)}</span>
                  <span>${priceRange[1].toFixed(2)}</span>
                </div>
              </div>

            </div>

            {/* Botón para cerrar los filtros en móviles */}
            <div className="md:hidden mt-4">
              <button
                className="w-full bg-blue-500 text-white py-2 rounded-md"
                onClick={() => setIsFilterVisible(false)}
              >
                Aplicar Filtros
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
