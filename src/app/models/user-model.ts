export interface User {
    name: string,
    photoUrl: string,
    email: string,
    stuckMode: boolean,
    stats: Stats
}

export interface Stats {
    averageSpeed: number,
    lastSpeed: number,
    averageErrors: number,
    lastErrors: number,
    samples: number,
}

export interface Fetch_Data {
    keyset: any,
    currentkey: string,
    words_count: number,
}

