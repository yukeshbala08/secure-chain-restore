import { Block, RecoveryData } from '@/types/blockchain';

export class Blockchain {
  private chain: Block[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  private createGenesisBlock(): Block {
    const genesisHash = this.simpleHash('0' + Date.now() + '0' + JSON.stringify({
      operationId: 'GENESIS',
      fileName: 'Genesis Block',
      fileHash: '0',
      status: 'success',
      recoveryType: 'full'
    }));
    
    return {
      index: 0,
      timestamp: Date.now(),
      data: {
        operationId: 'GENESIS',
        fileName: 'Genesis Block',
        fileHash: '0',
        status: 'success',
        recoveryType: 'full'
      },
      previousHash: '0',
      hash: genesisHash
    };
  }

  private simpleHash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }

  private async calculateHash(index: number, timestamp: number, previousHash: string, data: RecoveryData): Promise<string> {
    const blockData = `${index}${timestamp}${previousHash}${JSON.stringify(data)}`;
    return this.sha256(blockData);
  }

  private async sha256(data: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return this.simpleHash(data);
    }
  }

  async addBlock(data: RecoveryData): Promise<Block> {
    const previousBlock = this.chain[this.chain.length - 1];
    const newIndex = previousBlock.index + 1;
    const timestamp = Date.now();
    const hash = await this.calculateHash(newIndex, timestamp, previousBlock.hash, data);

    const newBlock: Block = {
      index: newIndex,
      timestamp,
      data,
      previousHash: previousBlock.hash,
      hash
    };

    this.chain.push(newBlock);
    return newBlock;
  }

  getChain(): Block[] {
    return this.chain;
  }

  async isChainValid(): Promise<boolean> {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      const recalculatedHash = await this.calculateHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.previousHash,
        currentBlock.data
      );

      if (currentBlock.hash !== recalculatedHash) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }
}
