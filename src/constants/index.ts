export enum INPUT_ICON {
	ON = 'on',
	OFF = 'off',
	ARROW = 'arrow'
};

export const emailPattern = /^[A-Za-z0-9]*@([-.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
export const telNumberPattern = /^[0-9]{10,11}$/;

export const COUNT_BY_PAGE = 5;
export const COUNT_BY_PAGE_COMMENT = 3;
export const PAGE_BY_SECTION = 10;
export const COUNT_BY_SECTION = COUNT_BY_PAGE * PAGE_BY_SECTION;
export const COUNT_BY_SECTION_COMMENT = COUNT_BY_PAGE_COMMENT * PAGE_BY_SECTION;

export const BOARD_NUMBER_PATH_VARIABLE = ':boardNumber';
export const SEARCH_WORD_PATH_VARIABLE = ':searchWord';
export const USER_EMAIL_PATH_VARIABLE = ':userEmail';

export const MAIN_PATH = '/';
export const AUTH_PATH = '/auth';
export const BOARD_PATH = '/board';
export const WRITE_PATH = 'write';
export const DETAIL_PATH = (boardNumber: number | string) => `detail/${boardNumber}`;
export const UPDATE_PATH = (boardNumber: number | string) => `update/${boardNumber}`;

export const BOARD_WRITE_PATH = () => `${BOARD_PATH}/${WRITE_PATH}`;
export const BOARD_DETAIL_PATH = (boardNumber: number | string) => `${BOARD_PATH}/${DETAIL_PATH(boardNumber)}`;
export const BOARD_UPDATE_PATH = (boardNumber: number | string) => `${BOARD_PATH}/${UPDATE_PATH(boardNumber)}`;

export const USER_PAGE_PATH = (email:string) => `/user-page/${email}`;
export const SEARCH_PATH = (searchWord:string) => `/search/${searchWord}`;