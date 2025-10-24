export interface Block {
  index: number;
  timestamp: number;
  data: RecoveryData;
  previousHash: string;
  hash: string;
}

export interface RecoveryData {
  operationId: string;
  fileName: string;
  fileHash: string;
  originalHash?: string;
  status: 'success' | 'partial' | 'failed';
  recoveryType: 'full' | 'partial' | 'corrupted';
}

export interface BlockchainLog {
  chain: Block[];
  isValid: boolean;
}
