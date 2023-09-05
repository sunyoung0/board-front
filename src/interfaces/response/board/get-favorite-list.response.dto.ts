import ResponseDto from '../response.dto';

export default interface GetFavoriteListResponseDto extends ResponseDto {
	favoriteList: FavoriteListResponseDto[];
}

export interface FavoriteListResponseDto {
	nickname: string;
	email: string;
	profileImageUrl: string;
}