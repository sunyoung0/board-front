import ResponseDto from '../response.dto';

export default interface GetUserResponseDto extends ResponseDto {
	email: string;
	nickname: string;
	profileImageUrl: string;
}