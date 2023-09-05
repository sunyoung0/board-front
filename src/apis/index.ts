import axios from "axios";
import { SignInRequestDto, SignUpRequestDto} from "src/interfaces/request/auth";
import {
  PatchBoardRequestDto,
  PostBoardRequestDto,
  PostCommentRequestDto,
} from "src/interfaces/request/board";
import { PatchNicknameRequestDto, PatchProfileImageRequestDto } from "src/interfaces/request/user";
import { SignInResponseDto, SignUpResponseDto,
} from "src/interfaces/response/auth";
import {
  DeleteBoardResponseDto,
  GetBoardResponseDto,
  GetCommentListResponseDto,
  GetCurrentResponseDto,
  GetFavoriteListResponseDto,
  GetSearchBoardResponseDto,
  GetTop3ResponseDto,
  GetUserListResponseDto,
  PatchBoardResponseDto,
  PostBoardResponseDto,
  PostCommentResponseDto,
  PutFavoriteResponseDto,
} from "src/interfaces/response/board";
import ResponseDto from "src/interfaces/response/response.dto";
import { GetPopularListResponseDto, GetRelationListResponseDto } from "src/interfaces/response/search";
import {
  GetLoginUserResponseDto,
  GetUserResponseDto,
  PatchNicknameResponseDto,
  PatchProfileImageResponseDto,
} from "src/interfaces/response/user";

const API_DOMAIN = "http://43.202.4.202:4040/api/v1";
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;

const GET_TOP3_BOARD_LIST_URL = () => `${API_DOMAIN}/board/top-3`;
const GET_CURRENT_BOARD_LIST_URL = (section: number) => `${API_DOMAIN}/board/current-board/${section}`;
const GET_POPULAR_LIST_URL = () => `${API_DOMAIN}/search/popular`;

const GET_SEARCH_BOARD_LIST_URL = (searchWord: string, relationWord?: string) =>
  relationWord ? `${API_DOMAIN}/board/search/${searchWord}/${relationWord}` : `${API_DOMAIN}/board/search/${searchWord}`;
  
const GET_RELATION_LIST_URL = (searchWord: string) =>
  `${API_DOMAIN}/search/relation/${searchWord}`;
const GET_BOARD_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}`;
const GET_FAVORITE_LIST_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}/favorite-list`;
const GET_COMMENT_LIST_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}/comment-list`;

const PUT_FAVORITE_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}/favorite`;
const POST_COMMENT_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}/comment`;
const PATCH_BOARD_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}`;
const DELETE_BOARD_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}`;
const POST_BOARD_URL = () => `${API_DOMAIN}/board`;

const GET_USER_URL = (email: string) => `${API_DOMAIN}/user/${email}`;
const GET_USER_BOARD_LIST_URL = (email: string) =>
  `${API_DOMAIN}/board/user-list/${email}`;

const PATCH_USER_NICKNAME_URL = () => `${API_DOMAIN}/user/nickname`;
const PATCH_USER_PROFILE_URL = () => `${API_DOMAIN}/user/profile`;
const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;

const UPLOAD_FILE = () => `http://43.202.4.202:4040/file/upload`;

export const signUpRequest = async (data: SignUpRequestDto) => {
  const result = await axios
    .post(SIGN_UP_URL(), data) // await : 리턴할때까지 기다림
    .then((response) => {
      const responseBody: SignUpResponseDto = response.data;
      const { code } = responseBody;
      return code;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      const { code } = responseBody;
      return code;
    });

  return result;
};

export const SignInRequest = async (data: SignInRequestDto) => {
  const result = await axios
    .post(SIGN_IN_URL(), data)
    .then((response) => {
      const responseBody: SignInResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });

  return result;
};

export const getTop3BoardListRequest = async () => {
  const result = await axios
    .get(GET_TOP3_BOARD_LIST_URL()) // get방식에선 data가 붙을 수 없음
    .then((response) => {
      const responseBody: GetTop3ResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      const responseBody:ResponseDto = error.response.data;
      return responseBody;
    });

  return result;
};

export const getCurrentBoardListRequest = async (section: number) => {
  const result = await axios
    .get(GET_CURRENT_BOARD_LIST_URL(section))
    .then((response) => {
      const responseBody: GetCurrentResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });

  return result;
};

export const getPopularListRequest = async () => {
  const result = await axios
    .get(GET_POPULAR_LIST_URL())
    .then((response) => {
      const responseBody: GetPopularListResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });

  return result;
};

export const getSearchBoardListRequest = async (searchWord: string, relationWord?: string) => {
  const result = await axios
    .get(GET_SEARCH_BOARD_LIST_URL(searchWord, relationWord))
    .then((response) => {
      const responseBody: GetSearchBoardResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });

  return result;
};

export const getRelationListRequest = async (searchWord: string) => {
  const result = await axios
    .get(GET_RELATION_LIST_URL(searchWord))
    .then((response) => {
      const responseBody: GetRelationListResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });

  return result;
};

export const getBoardRequest = async (boardNumber: number | string) => {
  const result = await axios
    .get(GET_BOARD_URL(boardNumber))
    .then((response) => {
      const responseBody: GetBoardResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });

  return result;
};

export const getFavoriteListRequest = async (boardNumber: number | string) => {
  const result = await axios
    .get(GET_FAVORITE_LIST_URL(boardNumber))
    .then((response) => {
      const responseBody: GetFavoriteListResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });

  return result;
};

export const getCommentListRequest = async (boardNumber: number | string) => {
  const result = await axios
    .get(GET_COMMENT_LIST_URL(boardNumber))
    .then((response) => {
      const responseBody: GetCommentListResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });

  return result;
};

export const putFavoriteRequest = async (
  boardNumber: number | string,
  token: string
) => {
  const result = await axios
    .put(PUT_FAVORITE_URL(boardNumber), {}, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      const responseBody: PutFavoriteResponseDto = response.data;
      const { code } = responseBody;
      return code;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      const { code } = responseBody;
      return code;
    });

  return result;
};

export const postCommentRequest = async (
  boardNumber: number | string,
  data: PostCommentRequestDto,
  token: string
) => {
  const result = await axios
    .post(POST_COMMENT_URL(boardNumber), data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      const responseBody: PostCommentResponseDto = response.data;
      const { code } = responseBody;
      return code;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      const { code } = responseBody;
      return code;
    });

  return result;
};

export const patchBoardRequest = async (
  boardNumber: number | string,
  data: PatchBoardRequestDto,
  token: string
) => {
  const result = await axios
    .patch(PATCH_BOARD_URL(boardNumber), data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      const responseBody: PatchBoardResponseDto = response.data;
      const { code } = responseBody;
      return code;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      const { code } = responseBody;
      return code;
    });

  return result;
};

export const deleteBoardRequest = async (
  boardNumber: number | string,
  token: string
) => {
  const result = await axios
    .delete(DELETE_BOARD_URL(boardNumber), {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      const responseBody: DeleteBoardResponseDto = response.data;
      const { code } = responseBody;
      return code;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      const { code } = responseBody;
      return code;
    });

  return result;
};

export const uploadFileRequest = async (data: FormData) => {
  const result = await axios
    .post(UPLOAD_FILE(), data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => {
      const imageUrl: string = response.data;
      return imageUrl;
    })
    .catch((error) => null);

  return result;
};

export const postBoardRequest = async (
  data: PostBoardRequestDto,
  token: string
) => {
  const result = await axios
    .post(POST_BOARD_URL(), data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      const responseBody: PostBoardResponseDto = response.data;
      const { code } = responseBody;
      return code;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      const { code } = responseBody;
      return code;
    });

  return result;
};

export const getUserRequest = async (email: string) => {
  const result = await axios
    .get(GET_USER_URL(email))
    .then((response) => {
      const responseBody: GetUserResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });

  return result;
};

export const getUserBoardListRequest = async (email: string) => {
  const result = await axios
    .get(GET_USER_BOARD_LIST_URL(email))
    .then((response) => {
      const responseBody: GetUserListResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });

  return result;
};

export const patchNicknameRequest = async (data: PatchNicknameRequestDto, token: string) => {
  const result = await axios
    .patch(PATCH_USER_NICKNAME_URL(), data, { headers : { Authorization: `Bearer ${token}`}})
    .then((response) => {
      const responseBody: PatchNicknameResponseDto = response.data;
      const { code } = responseBody;
      return code;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      const { code } = responseBody;
      return code;
    });

  return result;
};

export const patchProfileImageRequest = async (data: PatchProfileImageRequestDto, token: string) => {
  const result = await axios
    .patch(PATCH_USER_PROFILE_URL(), data, { headers : { Authorization: `Bearer ${token}`}})
    .then((response) => {
      const responseBody: PatchProfileImageResponseDto = response.data;
      const { code } = responseBody;
      return code;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      const { code } = responseBody;
      return code;
    });

  return result;
};

export const getSignInUserRequest = async (token: string) => {
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  const result = await axios
    .get(GET_SIGN_IN_USER_URL(), headers)
    .then((response) => {
      const responseBody: GetLoginUserResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });

  return result;
};
