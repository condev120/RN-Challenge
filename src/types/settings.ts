export interface IGenreItem {
  id: number
  name: string
}

export interface IGetGenresListResponse {
  genres: IGenreItem[]
}
