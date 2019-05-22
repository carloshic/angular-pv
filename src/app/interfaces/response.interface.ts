import { Status } from '../definitions/definitions';
import { IToken } from './token.interface';

export interface IResponse {
    status: Status;
    message: string;
    token?: IToken;
    data?: any;
    error?: any;
}
