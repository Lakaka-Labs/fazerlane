export interface LaneCreationData {
  message: string;
  laneId: string;
}

export interface LaneCreationResponse {
  statusCode: number;
  message: string;
  data: LaneCreationData;
}
