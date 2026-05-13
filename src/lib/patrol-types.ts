export type PatrolStatus = 'Verified' | 'Missed' | 'Late';

export interface PatrolEvent {
  id: string;
  bluetoothMac: string;
  name: string;
  location: string;
  date: string;
  time: string;
  espId: string;
  guardId: string;
  status: PatrolStatus;
  receivedAt: string;
}

export interface PatrolEventPayload {
  bluetoothMac: string;
  name: string;
  location: string;
  espId?: string;
  guardId?: string;
  status?: PatrolStatus;
  /** Optional ISO datetime from device; server time used if omitted */
  detectedAt?: string;
  secret?: string;
}
