export interface LoginUserRequestDto {
    email: string;
    password: string;
}

export interface LoginUserResponseDto {
    accessToken: string;
}
