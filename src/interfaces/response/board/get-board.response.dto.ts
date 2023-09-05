import ResponseDto from '../response.dto';

export default interface GetBoardResponseDto extends ResponseDto {
	boardNumber: number;
	title: string;
	contents: string;
	imageUrl: string | null;
	writeDatetime: string;
	writerEmail: string;
	writerProfileImage: string | null;
	writerNickname: string;
}