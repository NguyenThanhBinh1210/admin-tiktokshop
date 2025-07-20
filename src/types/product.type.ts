export interface Product {
  name: string
  image: string[]
  images: string[]
  price: number | string
  price_after_discount: number
  countInStock: number | string
  rating?: number
  description?: string
  _id: string
  selled?: number
  discount: number | string
  createdAt: string
  updatedAt: string
}

export interface ProductList {
  data: Product[]
  message: string
  status: string
  totalPage: number
  total: number
  pageCurrent: number
}

export interface ProductListComfig {
  page?: number
  limit?: number
  filter?: string
  sort_by?: 'createdAt' | 'countInStock' | 'selled' | 'price'
  order?: 'desc' | 'asc'
  category?: string
  name?: string
  rating_filter?: number | string
  price_min?: number
  price_max?: number
}
