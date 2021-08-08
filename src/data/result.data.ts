export interface JResult<Type> {
    result: boolean;
    errorCode: string;
    errorMessage: string;
    value?: Type;
}

export interface JResultList<Type> {
    result: boolean;
    errorCode: string;
    errorMessage: string;
    value?: Type[];
}