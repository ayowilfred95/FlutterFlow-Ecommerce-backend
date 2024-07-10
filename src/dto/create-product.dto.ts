export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string[];
  quantity: number;
  rating: number;
  reviews: string[];

}
