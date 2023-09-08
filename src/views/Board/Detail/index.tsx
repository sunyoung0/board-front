import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { deleteBoardRequest, getBoardRequest } from 'src/apis';
import { BOARD_UPDATE_PATH, MAIN_PATH } from 'src/constants';
import { GetBoardResponseDto } from 'src/interfaces/response/board';
import ResponseDto from 'src/interfaces/response/response.dto';
import { dateFormat } from 'src/utils';

import defaultProfileImage from 'src/assets/default-profile-image.png';
import './style.css';
import { useUserStore } from 'src/stores';
import { useCookies } from 'react-cookie';

//          component          //
// description: 게시물 상세 화면 //
export default function BoardDetail() {

	//											state										//
	// description : 게시물 번호 path variable 상태 //
	const { boardNumber } = useParams();

	// description : 로그인 유저 정보 상태 //
	const { user } = useUserStore();

	// description : 쿠키 상태 //
	const [cookies] = useCookies();

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
		// description : 게시물 불러오기 응답 처리 //
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

		// description : 게시물 삭제 응답 처리 //
		const deleteBoardResponseHandler = (code: string) => {
			if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'NB') alert('존재하지 않는 게시물입니다.');
      if (code === 'NP') alert('권한이 없습니다.');
      if (code === 'VF') alert('잘못된 입력입니다.');
			if (code === 'AF') alert('로그인이 필요합니다.');
      if (code === 'DE') alert('데이터베이스 에러입니다.');
      if (code !== 'SU') return;

      alert('게시물 삭제에 성공했습니다.');
      navigator(MAIN_PATH);
		}

		//					event handler					//
		// description : more button 클릭 이벤트 처리 //
		const onMoreButtonClickHandler = () => {
			setShowMore(!showMore);
		}

		// description : 수정 버튼 클릭 이벤트 처리 //
		const onUpdateClickHandler = () => {
			if (!boardNumber) return;
			navigator(BOARD_UPDATE_PATH(boardNumber));
		}

		// description : 삭제 버튼 클릭 이벤트 처리 //
		const onDeleteButtonClickHandler = () => {
			const accessToken = cookies.accessToken;

			if (!boardNumber) return;
			deleteBoardRequest(boardNumber, accessToken).then(deleteBoardResponseHandler);
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
									<div className='more-button' onClick={onUpdateClickHandler}> {'수정'}</div>
									<div className='divider'></div>
									<div className='more-button-red' onClick={onDeleteButtonClickHandler}>{'삭제'}</div>
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
			<div className='board-bottom'>
				<div className='board-bottom-button-container'>
					<div className='board-bottom-button-group'>
						<div className='board-detail-bottom-button'>
							<div className='favorite-icon'></div>
						</div>
						<div className='board-detail-bottom-text'>{`좋아요 12`}</div>
						<div className='board-detail-bottom-button'>
							<div className='down-icon'></div>
						</div>
					</div>
					<div className='board-bottom-button-group'>
						<div className='board-detail-bottom-icon'>
							<div className='comment-icon'></div>
						</div>
						<div className='board-detail-bottom-text'>{`댓글 10`}</div>
						<div className='board-detail-bottom-button'>
						<div className='down-icon'></div>
						</div>
					</div>
				</div>
				<div className='board-favorite-container'>
					<div className='board-favorite-box'>
						<div className='board-favorite-title'>{'좋아요 '}<span className='emphasis'>{12}</span></div>
						<div className='board-favorite-list'></div>
					</div>
				</div>
				<div className='board-comments-container'>
					<div className='board-comments-box'>
						<div className='board-comments-title'>{'댓글'}<span className='emphasis'>{4}</span></div>
						<div className='board-comments-list'></div>
					</div>
					<div className='divider'></div>
					<div className='board-comments-pagination-box'></div>
					<div className='board-comments-input-box'>
						<div className='board-comments-input-container'>
							<textarea className='board-comments-input' placeholder='댓글을 작성해주세요.'/>
							<div className='board-comments-button-box'>
								<div className='black-button'>댓글달기</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	//          render          //
	return (
		<div id='board-detail-wrapper'>
			<div className='board-container'>
			<Board />
			<BoardBottom />
			</div>
		</div>
	)
}
