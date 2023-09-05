import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CommentListItem from 'src/components/CommentListItem';
import Pagination from 'src/components/Pagination';
import { BOARD_UPDATE_PATH, COUNT_BY_PAGE_COMMENT, MAIN_PATH, USER_PAGE_PATH } from 'src/constants';
import { usePagination } from 'src/hooks';

import { useUserStore } from 'src/stores';

import './style.css';
import { useCookies } from 'react-cookie';
import { deleteBoardRequest, getBoardRequest, getCommentListRequest, getFavoriteListRequest, postCommentRequest, putFavoriteRequest } from 'src/apis';
import { PostCommentRequestDto } from 'src/interfaces/request/board';
import { GetBoardResponseDto, GetCommentListResponseDto, GetFavoriteListResponseDto } from 'src/interfaces/response/board';
import { CommentListResponseDto } from 'src/interfaces/response/board/get-comment-list.response.dto';
import { FavoriteListResponseDto } from 'src/interfaces/response/board/get-favorite-list.response.dto';
import ResponseDto from 'src/interfaces/response/response.dto';
import { dateFormat } from 'src/utils';

import defaultProfileImage from 'src/assets/default-profile-image.png';

//          component          //
// description: 게시물 상세 화면 //
export default function BoardDetail() {
  //          state          //
  // description: 게시물 번호 상태 //
  const { boardNumber } = useParams();

  // description : 로그인 유저 정보 상태 //
  const { user } = useUserStore();

  // description : 페이지네이션 관련 상태 및 함수 //
  const { totalPage, currentPage, currentSection, onPageClickHandler, onPreviousClickHandler, onNextClickHandler, changeSection } = usePagination();

  // description : Cookie 상태 //
  const [cookie, setCookies] = useCookies();

  // description: 게시물 정보 상태 //
  const [board, setBoard] = useState<GetBoardResponseDto | null>(null);

  // description: 게시물 좋아요 회원 리스트 상태 //
  const [favoriteList, setFavoriteList] = useState<FavoriteListResponseDto[]>([]);

  // description: 댓글 리스트 상태 //
  const [commentList, setCommentList] = useState<CommentListResponseDto[]>([]);

  // description : 현재 페이지에서 보여줄 댓글 리스트 상태 //
  const [pageCommentList, setPageCommentList] = useState<CommentListResponseDto[]>([]);

  // description: 좋아요 리스트 컴포넌트 출력 상태 //
  const [showFavoriteList, setShowFavoriteList] = useState<boolean>(false);

  //description : 댓글 리스트 컴포넌트 출력 상태 //
  const [showCommentList, setShowCommentList] = useState<boolean>(false);

  //          function          //
  // description : 페이지 이동을 위한 네비게이트 함수 //
  const navigator = useNavigate();

  // description  현재 페이지의 댓글 리스트 분류 함수 //
  const getPageCommentList = (commentList: CommentListResponseDto[]) => {
    const lastIndex = commentList.length > COUNT_BY_PAGE_COMMENT * currentPage ?
      COUNT_BY_PAGE_COMMENT * currentPage : commentList.length;
    
    const startIndex = COUNT_BY_PAGE_COMMENT * (currentPage -1);

    const pageCommentList = commentList.slice(startIndex, lastIndex);

    setPageCommentList(pageCommentList);
  }

  // description : 게시물 불러오기 요청 함수 //
  const getBoardResponseHandler = (responseBody: GetBoardResponseDto | ResponseDto) => {
    const { code } = responseBody;

    if (code === 'NB') alert('존재하지 않는 게시물입니다.');
    if (code === 'VF') alert('게시물 번호가 잘못되었습니다.');
    if (code === 'DE') alert('데이터베이스 에러입니다.');
    if (code !== 'SU') {
      navigator(MAIN_PATH);
      return;
    }

    setBoard(responseBody as GetBoardResponseDto);
  }

  // description : 좋아요 리스트 불러오기 요청 함수 //
  const getFavoriteResponseHandler = (responseBody: GetFavoriteListResponseDto | ResponseDto) => {
    const { code } = responseBody;

    if (code === 'VF') alert('잘못된 게시물 번호입니다.');
    if (code === 'DE') alert('데이터베이스 에러입니다.');
    if (code !== 'SU') {
      setFavoriteList([]);
      return;
    }

    const { favoriteList } = responseBody as GetFavoriteListResponseDto;
    setFavoriteList(favoriteList);
  }

  // description : 댓글 리스트 불러오기 응답 처리 함수 //
  const getCommentResponseHandler = (responseBody: GetCommentListResponseDto | ResponseDto) => {
    const { code } = responseBody;

    if (code === 'VF') alert('잘못된 게시물 번호입니다.');
    if (code === 'DE') alert('데이터베이스 에러입니다.');
    if (code !== 'SU') {
      setCommentList([]);
      return;
    }

    const { commentList } = responseBody as GetCommentListResponseDto;
    setCommentList(commentList);

    getPageCommentList(commentList);

    changeSection(commentList.length, COUNT_BY_PAGE_COMMENT);
  }

  //          event handler          //

  //          component          //
  // description: 실제 게시물 컴포넌트 //
  const Board = () => {
    //          state          //
    // description: more 버튼 출력 상태 //
    const [viewMore, setViewMore] = useState<boolean>(true);

    // description: more 버튼 클릭 상태 //
    const [openMore, setOpenMore] = useState<boolean>(false);

    // description: favorite 상태 //
    const [favorite, setFavorite] = useState<boolean>(false);

    //          function          //
    // description : 좋아요 응답 처리 함수 //
    const putFavoriteResponseHandler = (code: string) => {
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'NB') alert('존재하지 않는 게시물입니다.');
      if (code === 'VF') alert('잘못된 입력입니다.');
      if (code === 'DE') alert('데이터베이스 에러입니다.');
      if (code !== 'SU') return;

      if (!boardNumber) return;
      getFavoriteListRequest(boardNumber).then(getFavoriteResponseHandler);
    }

    // description : 게시물 삭제 응답 처리 함수 //
    const DeleteBoardResponseHandler = (code: string) => {
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'NB') alert('존재하지 않는 게시물입니다.');
      if (code === 'NP') alert('권한이 없습니다.');
      if (code === 'VF') alert('잘못된 입력입니다.');
      if (code === 'DE') alert('데이터베이스 에러입니다.');
      if (code !== 'SU') return;

      alert('게시물 삭제에 성공했습니다.');
      navigator(MAIN_PATH);
    }

    //          event handler          //
    // description : 작성자 닉네임 클릭 이벤트 //
    const onWriterNicknameClickHandler = () => {
      if (!board) return;
      navigator(USER_PAGE_PATH(board?.writerEmail));
    }

    // description: more 버튼 클릭 이벤트 //
    const onMoreButtonClickHandler = () => {
      setOpenMore(!openMore);
    }

    // description : 수정 버튼 클릭 이벤트 //
    const onUpdateButtonClickHandler = () => {
      if (!board) return;
      navigator(BOARD_UPDATE_PATH(board.boardNumber));
    }

    // description : 삭제 버튼 클릭 이벤트 //
    const onDeleteButtonClickHandler = () => {
     if (!boardNumber) return;
     const token = cookie.accessToken;
      deleteBoardRequest(boardNumber, token).then(DeleteBoardResponseHandler);
    }

    // description: 좋아요 버튼 클릭 이벤트 //
    const onFavoriteButtonClickHandler = () => {
      if (!boardNumber) return;
      const token = cookie.accessToken;
      putFavoriteRequest(boardNumber, token).then(putFavoriteResponseHandler);
    }

    // description: 좋아요 리스트 펼치기 클릭 이벤트 //
    const onShowFavoriteListButtonClickHandler = () => {
      setShowFavoriteList(!showFavoriteList);
    }

    // description : 댓글 리스트 펼치기 클릭 이벤트 //
    const onShowCommentListButtonClickHandler = () => {
      setShowCommentList(!showCommentList);
    }

    //          effect          //
    // description : 좋아요 리스트가 변경되면 실행 //
     useEffect(() => {
      const favorited = favoriteList.findIndex((item) => item.email === user?.email);
      setFavorite(favorited !== -1);
    },[favoriteList]);

    // description : 게시물 번호 혹은 로그인 유저 정보가 변경되면 실행 //
    useEffect(() => {
      setViewMore(user?.email === board?.writerEmail );
      const favorited = favoriteList.findIndex((item) => item.email === user?.email);
      setFavorite(favorited !== -1);
    },[boardNumber, user]);

    //          render          //
    return (
      <div className='board-detail-container'>
        <div className='board-detail-top'>
          <div className='board-detail-title-container'>
            <div className='board-detail-title'>{board?.title}</div>
          </div>
          <div className='board-detail-meta-container'>
            <div className='board-detail-meta-left'>
              <div className='board-detail-writer-profile-image' style={{ backgroundImage: `url(${board?.writerProfileImage ? board?.writerProfileImage : defaultProfileImage })` }}></div>
              <div className='board-detail-writer-nickname' onClick={onWriterNicknameClickHandler}>{board?.writerNickname}</div>
              <div className='board-detail-write-date'>{'\|'}</div>
              <div className='board-detail-write-date'>{dateFormat(board?.writeDatetime as string)}</div>
            </div>
            <div className='board-detail-meta-right'>
              {openMore && (
                <div className='more-button-group'>
                  <div className='more-button' onClick={onUpdateButtonClickHandler}>수정</div>
                  <div className='divider'></div>
                  <div className='more-button-red' onClick={onDeleteButtonClickHandler}>삭제</div>
                </div>
              )}
              {viewMore && (
                <div className='board-detail-more-button' onClick={onMoreButtonClickHandler}>
                  <div className='more-icon'></div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='divider'></div>
        <div className='board-detail-middle'>
          <div className='board-detail-content'>{board?.contents}</div>
          <div className='board-detail-image-box'>
            <img className='board-detail-image' src={board?.imageUrl ? board?.imageUrl : ''} />
          </div>
        </div>
        <div className='board-detail-bottom'>
          <div className='board-detail-bottom-item'>
            <div className='board-detail-bottom-button' onClick={onFavoriteButtonClickHandler}>
              { favorite ? (<div className='favorite-fill-icon'></div>) : (<div className='favorite-icon'></div>) }
            </div>
            <div className='board-detail-bottom-text'>{`좋아요 ${favoriteList.length}`}</div>
            <div className='board-detail-bottom-button' onClick={onShowFavoriteListButtonClickHandler}>
              { showFavoriteList ? (<div className='up-icon'></div>) : (<div className='down-icon'></div>) }
            </div>
          </div>
          <div className='board-detail-bottom-item'>
            <div className='board-detail-bottom-button'>
              <div className='comment-icon'></div>
            </div>
            <div className='board-detail-bottom-text'>{`댓글 ${commentList.length}`}</div>
            <div className='board-detail-bottom-button' onClick={onShowCommentListButtonClickHandler}>
              { showCommentList ? (
                <div className='up-icon'></div>
              ) : (
                <div className='down-icon'></div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    );
  }

  //          component         //
  // description: 좋아요 리스트 컴포넌트 //
  const FavoriteList = () => {

    //          state          //
    
    //          function          //
    
    //          event handler         //
   
    //          component         //
   
    //          effect          //

    //          render          //
    return (
      <div className='favorite-list-box'>
        <div className='favorite-list-title'>좋아요 <span className='favorite-list-title-emphasis'>{favoriteList.length}</span></div>
        <div className='favorite-list-container'>
          {favoriteList.map((item) => (
            <div className='favorite-list-item'>
              <div className='favorite-user-profile' style={{ backgroundImage: `url(${item.profileImageUrl ? item.profileImageUrl : defaultProfileImage })` }}></div>
              <div className='favorite-user-nickname'>{item.nickname}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  //          component          //
  // description: 댓글 컴포넌트 //
  const Comments = () => {
    //          state         //
    // description : 사용자 댓글 입력 상태 //
    const [comment, setComment] = useState<string>('');

    //          function          //
    // description : 댓글 작성 응답 처리 함수 //
    const PostCommentResponseHandler = (code: string) => {
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'NB') alert('존재하지 않는 게시물입니다.');
      if (code === 'VF') alert('잘못된 입력입니다.');
      if (code === 'DB') alert('데이터베이스 에러입니다.');
      if (code !== 'SU') return;

      if (!boardNumber) return;
      getCommentListRequest(boardNumber).then(getCommentResponseHandler);

    }

    //          event handler         //
    // description : 사용자 댓글 입력 변경 이벤트 //
    const onCommentChangeHandler = (event:ChangeEvent<HTMLTextAreaElement>) => {
      setComment(event.target.value);
    }
    
    // description : 댓글 작성 버튼 클릭 이벤트 //
    const onCommentButtonClickHandler = () => {
      if (!boardNumber) return;
      const token = cookie.accessToken;
      const data: PostCommentRequestDto = {
        contents: comment
      }
      postCommentRequest(boardNumber, data, token).then(PostCommentResponseHandler);
    }

    //          component       //

    //          effect          //

    //          render          //
    return (
      <div className='comment-list-box'>
				<div className='comment-list-top'>
					<div className='comment-list-title'> 댓글 <span className='comment-list-title-emphasis'> {commentList.length}</span></div>
					<div className='comment-list-container'>
						{ pageCommentList.map((item) => (<CommentListItem item={ item } />))}
					</div>
				</div>
				<div className='divider'></div>
        { commentList.length !== 0 && (
          <Pagination totalPage={totalPage} currentPage={currentPage} onPageClickHandler={onPageClickHandler} onPreviousClickHandler={onPreviousClickHandler} onNextClickHandler={onNextClickHandler}/>
        )}
				<div className='comment-box'>
					<textarea className='comment-textarea' placeholder='댓글을 작성해주세요.' rows={3} value={comment} onChange={onCommentChangeHandler}></textarea>
					<div className='comment-button-box'>
            { comment ? (<div className='black-button' onClick={onCommentButtonClickHandler}>댓글달기</div>) : (<div className='disable-button'> 댓글달기</div>)}
					</div>
				</div>
			</div>
    );
  }

  //          effect          //
  // description: 게시물 번호가 바뀔 때마다 새로운 정보 받아오기 //
  useEffect(() => {
    
    if (!boardNumber) {
      alert('게시물번호가 잘못되었습니다.');
      navigator(MAIN_PATH);
      return;
    }

    getBoardRequest(boardNumber).then(getBoardResponseHandler);
    getFavoriteListRequest(boardNumber).then(getFavoriteResponseHandler);
    getCommentListRequest(boardNumber).then(getCommentResponseHandler);

  }, [boardNumber]);

  // description : 현재 페이지가 바뀔때마다 검색 게시물 분류 //
  useEffect(() => {
    getPageCommentList(commentList);
  }, [currentPage])

  // description : 현재 페이지가 바뀔때마다 페이지 리스트 변경 //
  useEffect(() => {
    changeSection(commentList.length, COUNT_BY_PAGE_COMMENT);
  },[currentSection])

  //          render          //
  return (
    <div id='board-detail-wrapper'>
      <Board />
      {showFavoriteList && (<FavoriteList />)}
      {showCommentList && (<Comments />)}
    </div>
  )
}