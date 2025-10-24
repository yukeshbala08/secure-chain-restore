import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RecoveryResult } from '@/lib/recovery';
import { Separator } from '@/components/ui/separator';

interface RecoveryResultsProps {
  result: RecoveryResult;
  operationId: string;
}

export function RecoveryResults({ result, operationId }: RecoveryResultsProps) {
  const getStatusIcon = () => {
    if (result.integrityMatch) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (result.recoveryRate >= 50) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (result.recoveryType === 'full') return <Badge className="bg-green-500">Full Recovery</Badge>;
    if (result.recoveryType === 'partial') return <Badge className="bg-yellow-500">Partial Recovery</Badge>;
    return <Badge variant="destructive">Data Corrupted</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle>Recovery Results</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>Operation ID: {operationId}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Recovery Rate</span>
            <span>{result.recoveryRate}%</span>
          </div>
          <Progress value={result.recoveryRate} className="h-2" />
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">File Name</p>
            <p className="text-sm font-mono break-all">{result.originalFile.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">File Size</p>
            <p className="text-sm">{(result.originalFile.size / 1024).toFixed(2)} KB</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Hash Verification</h4>
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Original Hash (SHA-256)</p>
              <p className="text-xs font-mono break-all bg-muted p-2 rounded">
                {result.originalHash}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Recovered Hash (SHA-256)</p>
              <p className="text-xs font-mono break-all bg-muted p-2 rounded">
                {result.recoveredHash}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-md bg-muted">
            {result.integrityMatch ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Integrity Verified - Hashes Match</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Integrity Check Failed - Hashes Don't Match</span>
              </>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Forensic Analysis</h4>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p>• Recovery Type: <span className="font-medium text-foreground">{result.recoveryType}</span></p>
            <p>• Data Integrity: <span className="font-medium text-foreground">{result.integrityMatch ? 'Preserved' : 'Compromised'}</span></p>
            <p>• Evidence Status: <span className="font-medium text-foreground">Logged in Blockchain</span></p>
            <p>• Timestamp: <span className="font-medium text-foreground">{new Date().toLocaleString()}</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
