export enum TimerStatus {
    IDLE = 'idle',
    RUNNING = 'running',
}

export type TimerStopPayload = {
    timeInSeconds: number
}

export type TimerStartPayload = {
    status: TimerStatus,
}
