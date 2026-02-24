export class LoginUserRequestDto {
    email!: string;
    password!: string;
}

export class LoginUserResponseDto {
    accessToken!: string;
}
