// movie.ts
import { Actor } from "./actor";
import { Director } from "./director";
import { Genre } from "./genre";

export interface Movie {
  movieId: number;
  title: string;
  synopsis: string;
  year: number
  duration: number 
  poster: string
  trailer: string;
  director: Director;
  actors: Actor[];  
  genres: Genre[];
  rating: number;
}

