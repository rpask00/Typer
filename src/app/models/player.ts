import { ServerResponse } from 'http';

export interface Player {
    socket: string,
    displayName: string,
    photoURL: string
}