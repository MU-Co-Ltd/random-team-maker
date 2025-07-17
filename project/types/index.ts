export interface Member {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamDivisionResult {
  id: string;
  participants: Member[];
  teamSize: number;
  teams: Member[][];
  createdAt: Date;
}

export interface TeamDivisionParams {
  selectedMembers: Member[];
  teamSize: number;
}
