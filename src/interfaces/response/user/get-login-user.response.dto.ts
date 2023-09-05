import ResponseDto from '../response.dto';

export default interface GetLoginUserResponseDto extends ResponseDto {
	email: string;
	nickname: string;
	profileImageUrl: string;
}