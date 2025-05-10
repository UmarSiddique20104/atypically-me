// src/types.ts
import { StaticImageData } from 'next/image';

export interface User {
  id: string;
  name: string;
  rating: number;
  totalRatings: number;
  type: string;
  distance: number;
  images: string[];
  image: string;
  address: string;
  open: boolean;
  openingTime?: string;
  closingTime?: string;
  website: string;
  url: string;
  ratingPercentage?: number[];
  isRated?: boolean;
  userRatings?: number;
}




export interface ProfileData {
  nickName?: string | null;
  image:string
}


// src/types/index.ts
export interface Users {
  _id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  image: string;
}

export interface Discussion {
  attributes: {
      comments: string[];
      createdAt: string;
      likes: number;
      text: string;
      type: string;
      updatedAt: string;
      userId: Users;
  };
  id: string;
  type: string;
}





