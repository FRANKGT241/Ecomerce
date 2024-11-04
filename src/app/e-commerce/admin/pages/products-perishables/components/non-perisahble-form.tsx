import { useState, useEffect } from 'react';
import { Button } from "@/app/shared/components/button";
import { Input } from "@/app/shared/components/input";
import { Label } from "@/app/shared/components/label";
import { ImageUp, XCircle } from 'lucide-react';
import Image from 'next/image';

type ProductFormProps = {
  onSubmit: (data: FormData) => void;
  initialData?: any;
};

export function ProductForm({ onSubmit, initialData }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount: 0,
    category_id: 0,
    brand: '',
    batch_id: 0,
    supplier_id: 0,
    price: 0 ,
    keywords: '',
    meta_description: '' 
  });

  const [images, setImages] = useState<File[]>([]); // Nuevas imágenes seleccionadas
  const [existingImages, setExistingImages] = useState<string[]>([]); // Imágenes existentes desde la base de datos
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        discount: initialData.discount || 0,
        category_id: initialData.category_id || 0,
        brand: initialData.brand || '',
        batch_id: initialData.batch_id || 0,
        supplier_id: initialData.supplier_id || 0,
        price: initialData.price || 0,
        keywords: initialData.keywords || '',
        meta_description: initialData.meta_description || '',

      });

      // Cargar imágenes existentes desde los datos iniciales
      if (initialData.images) {
        setExistingImages(initialData.images); // Asumiendo que `images` es un array de URLs
      }
    }

    const token = localStorage.getItem("token"); // Obtener el token desde localStorage

    // Cargar categorías desde la API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token en las cabeceras
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar las categorías");
        return res.json();
      })
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error al cargar las categorías:", error));

    // Cargar proveedores desde la API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers`, {
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token en las cabeceras
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los proveedores");
        return res.json();
      })
      .then((data) => setSuppliers(data))
      .catch((error) => console.error("Error al cargar los proveedores:", error));
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []); // Convertir los archivos a array
    setImages((prevImages) => [...prevImages, ...selectedFiles]); // Agregar las imágenes seleccionadas
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index)); // Eliminar la imagen de la lista de nuevas imágenes
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index)); // Eliminar la imagen existente
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, (formData as any)[key]);
    });

    // Add newly selected images
    images.forEach((image) => {
      data.append('images', image);
    });

    // Include existing images that haven't been deleted
    existingImages.forEach((image) => {
      data.append('existingImages', image); // Ensure these are still included
    });

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Input id="description" name="description" type="text" value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="discount">Descuento</Label>
        <Input id="discount" name="discount" type="number" value={formData.discount} onChange={handleChange} />
      </div>

      <div>
        <Label htmlFor="category_id">Categoría</Label>
        <select
          id="category_id"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="block w-full mt-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="">Seleccione una categoría</option>
          {categories.map((category: any) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_id} - {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="brand">Marca</Label>
        <Input id="brand" name="brand" type="text" value={formData.brand} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="batch_id">Lote</Label>
        <Input id="batch_id" name="batch_id" type="number" value={formData.batch_id} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="name">Precio</Label>
        <Input id="price" name="price" type="text" value={formData.price} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="name">Palbras clave SEO</Label>
        <Input id="keywords" name="keywords" type="text" value={formData.keywords} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="meta_description">Descripción SEO</Label>
        <Input id="meta_description" name="meta_description" type="text" value={formData.meta_description} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="supplier_id">Proveedor</Label>
        <select
          id="supplier_id"
          name="supplier_id"
          value={formData.supplier_id}
          onChange={handleChange}
          className="block w-full mt-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="">Seleccione un proveedor</option>
          {suppliers.map((supplier: any) => (
            <option key={supplier.supplier_id} value={supplier.supplier_id}>
              {supplier.supplier_id} - {supplier.name}
            </option>
          ))}
        </select>
      </div>

      {/* Imágenes existentes */}
      {existingImages.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Imágenes actuales</label>
          <div className="mt-4 flex flex-wrap gap-4">
            {existingImages.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image} // Asumiendo que es una URL completa
                  alt={`Imagen ${index + 1}`}
                  width={128}
                  height={128}
                  className="object-cover rounded-md border"
                />

                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                >
                  <XCircle className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selección de nuevas imágenes */}
      <div className="mb-4">
        <label htmlFor="images" className="block text-sm font-medium text-gray-700">
          Imágenes del producto (Máximo 5)
        </label>
        <div className="flex items-center mt-2">
          <label
            htmlFor="images"
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ImageUp className="h-5 w-5 mr-2" aria-hidden="true" />
            Elegir archivos
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
          <span className="ml-2 text-sm text-gray-500">
            {images.length > 0 ? `${images.length} archivo(s) seleccionado(s)` : "No se eligió ningún archivo"}
          </span>
        </div>

        {/* Vista previa de nuevas imágenes */}
        <div className="mt-4 flex flex-wrap gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={URL.createObjectURL(image)}
                alt={`Imagen ${index + 1}`}
                width={128} // Especificar el ancho
                height={128} // Especificar la altura
                className="object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 text-red-600 hover:text-red-800"
              >
                <XCircle className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">Enviar</Button>
    </form>
  );
}
