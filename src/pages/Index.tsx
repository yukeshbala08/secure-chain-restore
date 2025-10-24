import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { RecoveryResults } from '@/components/RecoveryResults';
import { BlockchainViewer } from '@/components/BlockchainViewer';
import { DataRecovery, RecoveryResult } from '@/lib/recovery';
import { Blockchain } from '@/lib/blockchain';
import { Block } from '@/types/blockchain';
import { useToast } from '@/hooks/use-toast';
import { Shield, Database, Hash } from 'lucide-react';

const Index = () => {
  const [blockchain] = useState(() => new Blockchain());
  const [dataRecovery] = useState(() => new DataRecovery());
  const [chain, setChain] = useState<Block[]>([]);
  const [isChainValid, setIsChainValid] = useState(true);
  const [recoveryResult, setRecoveryResult] = useState<RecoveryResult | null>(null);
  const [operationId, setOperationId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setChain(blockchain.getChain());
  }, [blockchain]);

  const handleFileSelect = async (file: File, corruptionLevel: number) => {
    setIsProcessing(true);
    const opId = dataRecovery.generateOperationId();
    setOperationId(opId);

    try {
      toast({
        title: "Processing Started",
        description: `Simulating attack with ${corruptionLevel}% corruption...`,
      });

      // Simulate attack
      const corruptedFile = await dataRecovery.simulateAttack(file, corruptionLevel);

      // Attempt recovery
      const result = await dataRecovery.recoverFile(corruptedFile, file);
      setRecoveryResult(result);

      // Add to blockchain
      const block = await blockchain.addBlock({
        operationId: opId,
        fileName: file.name,
        fileHash: result.recoveredHash,
        originalHash: result.originalHash,
        status: result.success ? 'success' : 'failed',
        recoveryType: result.recoveryType
      });

      setChain(blockchain.getChain());
      
      // Validate chain
      const isValid = await blockchain.isChainValid();
      setIsChainValid(isValid);

      toast({
        title: "Recovery Complete",
        description: `Recovery rate: ${result.recoveryRate}% - Evidence logged in blockchain`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process recovery operation",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Post-Attack Data Retrieval System</h1>
              <p className="text-sm text-muted-foreground">
                Evidence Preservation & Recovery Platform
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Features Banner */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <span>Data Recovery Simulation</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" />
              <span>SHA-256 Hash Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Blockchain Evidence Log</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <FileUpload onFileSelect={handleFileSelect} />
            {recoveryResult && operationId && (
              <RecoveryResults result={recoveryResult} operationId={operationId} />
            )}
          </div>

          {/* Right Column */}
          <div>
            <BlockchainViewer chain={chain} isValid={isChainValid} />
          </div>
        </div>
      </main>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg font-medium">Processing recovery operation...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
