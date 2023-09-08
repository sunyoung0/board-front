import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getBoardRequest } from 'src/apis';
import { MAIN_PATH } from 'src/constants';
import { GetBoardResponseDto } from 'src/interfaces/response/board';
import ResponseDto from 'src/interfaces/response/response.dto';
import { dateFormat } from 'src/utils';

import defaultProfileImage from 'src/assets/default-profile-image.png';
import './style.css';
import { useUserStore } from 'src/stores';

//          component          //
// description: 게시물 상세 화면 //
export default function BoardDetail() {

	//											state										//
	// description : 게시물 번호 path variable 상태 //
	const { boardNumber } = useParams();

	// description : 로그인 유저 정보 상태 //
	const { user } = useUserStore();

	//					function					//
	// description : 네비게이트 함수
	const navigator = useNavigate();

	//          component          //
	// description: 게시물 내용 컴포넌트 //
	const Board = () => {

		//					state					//
		//	description : 게시물 상태 //
		const [board, setBoard] = useState<GetBoardResponseDto | null> (null);

		// description : 본인 게시물 여부 상태 //
		const [isWriter, setWriter] = useState<boolean>(false);

		// description : more button 상태 //
		const [showMore, setShowMore] = useState<boolean>(false);


		//				function					//

		const getBoardResponseHandler = (responseBody: GetBoardResponseDto | ResponseDto) => {
			const { code } = responseBody;

			if (code === 'NB') alert('존재하지 않는 게시물입니다.');
			if (code === 'VF') alert('게시물 번호가 잘못되었습니다.');
			if (code === 'DE') alert('데이터베이스 에러입니다.');
			if (code !== 'SU') {
				navigator(MAIN_PATH);
				return;
    	}

			const board = responseBody as GetBoardResponseDto;

			setBoard(board);
		}

		//					event handler					//
		// description : more button 클릭 이벤트 처리 //
		const onMoreButtonClickHandler = () => {
			setShowMore(!showMore);
		}

		//					effect					//
		// description : 게시물 번호가 바뀔 때마다 실행 //
		useEffect(() => {
			if (!boardNumber) {
				alert('게시물 번호가 잘못되었습니다.');
				navigator(MAIN_PATH);
				return;
			}
			getBoardRequest(boardNumber).then(getBoardResponseHandler);
		}, [boardNumber]);

		// description : 게시물과 유저 정보가 바뀔 때마다 실행 //
		useEffect( () => {
			const isWriter = user?.email === board?.writerEmail;
			setWriter(isWriter);
		},[board, user]);

		//          render          //
		return (
			<div className='board-detail-container'>
				<div className='board-detail-header'>
					<div className='board-detail-title'>{board?.title}</div>
					<div className='board-detail-meta-data'>
						<div className='board-detail-write-data'>
							<div className='board-detail-writer-profile-image' style={{backgroundImage: `url(${board?.writerProfileImage ? board.writerProfileImage : defaultProfileImage})`}}></div>
							<div className='board-detail-writer-nickname'>{board?.writerNickname}</div>
							<div className='board-detail-mata-divider'>{'\|'}</div>
							<div className='board-detail-write-date'>{dateFormat(board?.writeDatetime as string)}</div>
						</div>
						<div className='board-detail-more-button-box'>
							{showMore && (
								<div className='more-button-group'>
									<div className='more-button'> {'수정'}</div>
									<div className='divider'></div>
									<div className='more-button-red'>{'삭제'}</div>
								</div>
							)}
							{isWriter && (
								<div className='board-detail-more-button' onClick={onMoreButtonClickHandler}>
									<div className='more-icon'></div>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className='divider'></div>
				<div className='board-detail-body'>
					<div className='board-detail-contents'>{board?.contents}</div>
					<div className='board-detail-image-box'>
						<img className='board-detail-image' src={board?.imageUrl ? board?.imageUrl : ''} />
					</div>
				</div>
			</div>
		);
	}
	
	// description : 게시물 하단 컴포넌트 //
	const BoardBottom = () => {
		
		//          render          //
		return (
			<div></div>
		);
	}

	//          render          //
	return (
		<div id='board-detail-wrapper'>
			<Board />
			<BoardBottom />
		</div>
	)
}
