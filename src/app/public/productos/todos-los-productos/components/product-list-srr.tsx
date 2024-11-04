import ProductListClient from './product-list'

async function getProducts() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/products`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}
export default async function ProductListServer() {
  const products = await getProducts()

  return <ProductListClient initialProducts={products} />
}