import React, { useEffect, useState, ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { deleteBoardRequest, getBoardRequest, getCommentListRequest, getFavoriteListRequest, postCommentRequest, putFavoriteRequest } from 'src/apis';
import { BOARD_UPDATE_PATH, COUNT_BY_PAGE_COMMENT, MAIN_PATH } from 'src/constants';
import { GetBoardResponseDto } from 'src/interfaces/response/board';
import ResponseDto from 'src/interfaces/response/response.dto';
import { dateFormat } from 'src/utils';

import defaultProfileImage from 'src/assets/default-profile-image.png';

import './style.css';
import { useUserStore } from 'src/stores';
import { useCookies } from 'react-cookie';
import GetFavoriteListResponseDto, { FavoriteListResponseDto } from 'src/interfaces/response/board/get-favorite-list.response.dto';
import GetCommentListResponseDto, { CommentListResponseDto } from 'src/interfaces/response/board/get-comment-list.response.dto';
import { usePagination } from 'src/hooks';
import CommentListItem from 'src/components/CommentListItem';
import Pagination from 'src/components/Pagination';
import { PostCommentRequestDto } from 'src/interfaces/request/board';

//          component          //
// description: 게시물 상세 화면 //
export default function BoardDetail() {

  //          state          //
  // description: 게시물 번호 path variable 상태 //
  const { boardNumber } = useParams();
  // description: 로그인 유저 정보 상태 //
  const { user } = useUserStore();
  // description: 쿠키 상태 //
  const [cookies] = useCookies();

  //          function          //
  // description: 네비게이트 함수 //
  const navigator = useNavigate();

  //          component          //
  // description: 게시물 내용 컴포넌트 //
  const Board = () => {
    //          state          //
    // description: 게시물 상태 //
    const [board, setBoard] = useState<GetBoardResponseDto | null>(null);
    // description: 본인 게시물 여부 상태 //
    const [isWriter, setWriter] = useState<boolean>(false);
    // description: more 버튼 상태 //
    const [showMore, setShowMore] = useState<boolean>(false);

    //          function          //
    // description: 게시물 불러오기 응답 처리 //
    const getBoardResponseHandler = (responseBody: GetBoardResponseDto | ResponseDto) => {
      const { code } = responseBody;
      if (code === 'NB') alert('존재하지 않는 게시물입니다.');
      if (code === 'VF') alert('잘못된 게시물 번호입니다.');
      if (code === 'DE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') {
        navigator(MAIN_PATH);
        return;
      }

      const board = responseBody as GetBoardResponseDto;
      setBoard(board);
    }
    // description: 게시물 삭제 응답 처리 //
    const deleteBoardResponseHandler = (code: string) => {
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'NB') alert('존재하지 않는 게시물입니다.');
      if (code === 'NP') alert('권한이 없습니다.');
      if (code === 'VF') alert('잘못된 게시물입니다.');
      if (code === 'AF') alert('로그인이 필요합니다.');
      if (code === 'DE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      alert('게시물 삭제에 성공했습니다.');
      navigator(MAIN_PATH);
    }

    //          event handler          //
    // description: more 버튼 클릭 이벤트 처리 //
    const onMoreButtonClickHandler = () => {
      setShowMore(!showMore);
    }
    // description: 수정 버튼 클릭 이벤트 처리 //
    const onUpdateButtonClickHandler = () => {
      if (!boardNumber) return;
      navigator(BOARD_UPDATE_PATH(boardNumber));
    }
    // description: 삭제 버튼 클릭 이벤트 처리 //
    const onDeleteButtonclickHandler = () => {
      const accessToken = cookies.accessToken;
      if (!boardNumber) return;
      deleteBoardRequest(boardNumber, accessToken).then(deleteBoardResponseHandler);
    }

    //          effect          //
    // description: 게시물 번호가 바뀔 때 마다 실행 //
    let boardNumberFlag = true;
    useEffect(() => {
      if (boardNumberFlag) {
        boardNumberFlag = false;
        return;
      }
      if (!boardNumber) {
        alert('게시물번호가 잘못되었습니다.');
        navigator(MAIN_PATH);
        return;
      }
      getBoardRequest(boardNumber).then(getBoardResponseHandler);
    }, [boardNumber]);
    // description: 게시물과 유저 정보가 바뀔 때 마다 실행 //
    useEffect(() => {
      const isWriter = user?.email === board?.writerEmail;
      setWriter(isWriter);
    }, [board, user]);

    //          render          //
    return (
      <div className='board-detail-container'>
        <div className='board-detail-header'>
          <div className='board-detail-title'>{board?.title}</div>
          <div className='board-detail-meta-data'>
            <div className='board-detail-write-data'>
              <div className='board-detail-writer-profile-image' style={{ backgroundImage: `url(${board?.writerProfileImage ? board.writerProfileImage : defaultProfileImage})` }}></div>
              <div className='board-detail-writer-nickname'>{board?.writerNickname}</div>
              <div className='board-detail-meta-divider'>{'\|'}</div>
              <div className='board-detail-write-date'>{dateFormat(board?.writeDatetime as string)}</div>
            </div>
            <div className='board-detail-more-button-box'>
              {showMore && (
              <div className='more-button-group'>
                <div className='more-button' onClick={onUpdateButtonClickHandler}>{'수정'}</div>
                <div className='divider'></div>
                <div className='more-button-red' onClick={onDeleteButtonclickHandler}>{'삭제'}</div>
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
            <img className='board-detail-image' src={board?.imageUrl ? board.imageUrl : ''} />
          </div>
        </div>
      </div>
    );
  }
  // description: 게시물 하단 컴포넌트 //
  const BoardBottom = () => {

    //          state           //
    // description: 좋아요 렌더링 여부 상태 //
    const [showFavorite, setShowFavorite] = useState<boolean>(false);
    // description: 댓글 렌더링 여부 상태 //
    const [showComment, setShowComment] = useState<boolean>(false);
    // description: 좋아요 리스트 상태 //
    const [favoriteList, setFavoriteList] = useState<FavoriteListResponseDto[]>([]);
    // description: 좋아요 개수 상태 //
    const [favoriteCount, setFavoriteCount] = useState<number>(0);
    // description: 사용자 좋아요 상태 //
    const [isFavorite, setFavorite] = useState<boolean>(false);
    // description: 댓글 리스트 상태 //
    const [commentList, setCommentList] = useState<CommentListResponseDto[]>([]);
    // description: 댓글 개수 상태 //
    const [commentCount, setCommnetCount] = useState<number>(0);
    // description: 현재 페이지에서 보여줄 댓글 리스트 상태 //
    const [viewCommentList, setViewCommentList] = useState<CommentListResponseDto[]>([]);
    // description: 댓글 상태 //
    const [comment, setComment] = useState<string>('');
    // description: 페이지네이션 관련 상태 //
    const { totalPage, currentPage, currentSection,
      onNextClickHandler, onPreviousClickHandler, onPageClickHandler, changeSection } = usePagination();

    //          function          //
    // description: 좋아요 리스트 불러오기 응답 처리 함수 //
    const getFavoriteListResponseHandler = (responseBody: GetFavoriteListResponseDto | ResponseDto) => {

      const { code } = responseBody;
      if (code === 'VF') alert('잘못된 게시물번호입니다.');
      if (code === 'DE') alert('데이터베이스 에러입니다.');
      if (code !== 'SU') {
        setFavoriteList([]);
        setFavoriteCount(0);
        return;
      }

      const { favoriteList } = responseBody as GetFavoriteListResponseDto;
      setFavoriteList(favoriteList);
      setFavoriteCount(favoriteList.length);
    }
    // description: 좋아요 응답 처리 함수 //
    const putFavoriteResponseHandler = (code: string) => {
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'NB') alert('존재하지 않는 게시물입니다.');
      if (code === 'VF') alert('잘못된 게시물 번호입니다.');
      if (code === 'DE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      if (!boardNumber) return;
      getFavoriteListRequest(boardNumber).then(getFavoriteListResponseHandler);
    }
    // description: 댓글 리스트 불러오기 응답 처리 함수 //
    const getCommentListResponseHandler = (responseBody: GetCommentListResponseDto | ResponseDto) => {

      const { code } = responseBody;
      if (code === 'VF') alert('잘못된 게시물번호입니다.');
      if (code === 'DE') alert('데이터베이스 에러입니다.');
      if (code !== 'SU') {
        setCommentList([]);
        return;
      }

      const { commentList } = responseBody as GetCommentListResponseDto;
      setCommentList(commentList);
      setCommnetCount(commentList.length);

      changeSection(commentList.length, COUNT_BY_PAGE_COMMENT);
      getViewCommentList(commentList);

    }
    // description: 댓글 작성 응답 처리 함수 //
    const postCommentResponseHandler = (code: string) => {
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'NB') alert('존재하지 않는 게시물입니다.');
      if (code === 'VF') alert('잘못된 입력입니다.');
      if (code === 'DE') alert('데이터베이스 에러입니다.');
      if (code !== 'SU') return;

      setComment('');
      if (!boardNumber) return;
      getCommentListRequest(boardNumber).then(getCommentListResponseHandler);
    }

    // description: 현재 페이지의 댓글 리스트 분류 함수 //
    const getViewCommentList = (commentList: CommentListResponseDto[]) => {
      const lastIndex = commentList.length > COUNT_BY_PAGE_COMMENT * currentPage ?
        COUNT_BY_PAGE_COMMENT * currentPage : commentList.length;
      const startIndex = COUNT_BY_PAGE_COMMENT * (currentPage - 1);

      const viewCommentList = commentList.slice(startIndex, lastIndex);
      setViewCommentList(viewCommentList);
    }

    //          event handler          //
    // description: 댓글 변경 이벤트 처리 함수 //
    const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const comment = event.target.value;
      setComment(comment);
    };
    // description: 좋아요 렌더링 버튼 클릭 이벤트 처리 함수 //
    const onShowFavoriteButtonClickHandler = () => {
      setShowFavorite(!showFavorite);
    };
    // description: 댓글 렌더링 버튼 클릭 이벤트 처리 함수 //
    const onShowCommentButtomClickHandler = () => {
      setShowComment(!showComment);
    };
    // description: 좋아요 클릭 이벤트 처리 함수 //
    const onFavoriteClickHandler = () => {
      if (!boardNumber) return;
      const token = cookies.accessToken;
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
      putFavoriteRequest(boardNumber, token).then(putFavoriteResponseHandler);
    }
    // description: 댓글 달기 클릭 이벤트 처리 함수 //
    const onPostCommentButtonClickHandler = () => {
      if (!boardNumber) return;
      const token = cookies.accessToken;
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
      if (!comment) {
        alert('내용을 입력하세요.');
        return;
      }
      const data: PostCommentRequestDto = {
        contents: comment
      }
      postCommentRequest(boardNumber, data, token).then(postCommentResponseHandler);
    }

    //          effect          //
    // description: 조회하는 boardNumber가 변경될때 마다 실행될 함수 //
    useEffect(() => {
      if (!boardNumber) {
        alert('잘못된 접근입니다.');
        navigator(MAIN_PATH);
        return;
      }
      getFavoriteListRequest(boardNumber).then(getFavoriteListResponseHandler);
      getCommentListRequest(boardNumber).then(getCommentListResponseHandler);
    }, [boardNumber]);
    // description: favorite list가 변경될때 마다 실행될 함수 //
    useEffect(() => {
      setFavorite(false);
      if (!user) return;
      favoriteList.forEach(item => {if(item.email === user.email) setFavorite(true)})
    }, [favoriteList]);
    // description: current page가 변경될때 마다 실행될 함수 //
    useEffect(() => {
      getViewCommentList(commentList);
    }, [currentPage]);
    // description: current section이 변결될때 마다 실행될 함수 //
    useEffect(() => {
      changeSection(commentCount, COUNT_BY_PAGE_COMMENT);
    }, [currentSection]);

    //          render          //
    return (
      <div className='board-bottom'>
        <div className='board-bottom-button-container'>
          <div className='board-bottom-button-group'>
            <div className='board-detail-bottom-button' onClick={onFavoriteClickHandler}>
              {isFavorite ? (
              <div className='favorite-fill-icon'></div>
              ) : (
              <div className='favorite-icon'></div>
              )}
            </div>
            <div className='board-detail-bottom-text'>{`좋아요 ${favoriteCount}`}</div>
            <div className='board-detail-bottom-button' onClick={onShowFavoriteButtonClickHandler}>
              {showFavorite ? (
              <div className='up-icon'></div>
              ) : (
              <div className='down-icon'></div>
              )}
            </div>
          </div>
          <div className='board-bottom-button-group'>
            <div className='board-detail-bottom-icon'>
              <div className='comment-icon'></div>
            </div>
            <div className='board-detail-bottom-text'>{`댓글 ${commentCount}`}</div>
            <div className='board-detail-bottom-button' onClick={onShowCommentButtomClickHandler}>
              {showComment ? (
              <div className='up-icon'></div>
              ) : (
              <div className='down-icon'></div>
              )}
            </div>
          </div>
        </div>
        {showFavorite && (
        <div className='board-favorite-container'>
          <div className='board-favorite-box'>
            <div className='board-favorite-title'>{'좋아요 '}<span className='emphasis'>{favoriteCount}</span></div>
            <div className='board-favorite-list'>
              {favoriteList.map(({profileImageUrl, nickname}) => (
              <div className='board-favorite-item'>
                <div className='board-favorite-profile' style={{ backgroundImage: `url(${profileImageUrl ? profileImageUrl : defaultProfileImage})` }}></div>
                <div className='board-favorite-nickname'>{nickname}</div>
              </div>
              ))}
            </div>
          </div>
        </div>
        )}
        {showComment && (
        <div className='board-comments-container'>
          <div className='board-comments-box'>
            <div className='board-comments-title'>{'댓글 '}<span className='emphasis'>{commentCount}</span></div>
            <div className='board-comments-list'>
              {viewCommentList.map(commentItem => <CommentListItem item={commentItem} />)}
            </div>
          </div>
          <div className='divider'></div>
          <div className='board-comments-pagination-box'>
            {commentCount !== 0 && (
            <Pagination
              totalPage={totalPage}
              currentPage={currentPage}
              onPageClickHandler={onPageClickHandler}
              onNextClickHandler={onNextClickHandler}
              onPreviousClickHandler={onPreviousClickHandler}
            />
            )}
          </div>
          <div className='board-comments-input-box'>
            <div className='board-comments-input-container'>
              <textarea className='board-comments-input' placeholder='댓글을 작성해주세요.' value={comment} onChange={onCommentChangeHandler} />
              <div className='board-comments-button-box'>
                {comment.length === 0 ? (
                <div className='disable-button'>댓글달기</div>
                ) : (
                <div className='black-button' onClick={onPostCommentButtonClickHandler}>댓글달기</div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
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