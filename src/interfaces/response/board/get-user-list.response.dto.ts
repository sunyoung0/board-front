import ResponseDto from '../response.dto';
import BoardListResponseDto from './board-list.response.dto';

export default interface GetUserListResponseDto extends ResponseDto {
	boardList: BoardListResponseDto[];
}
