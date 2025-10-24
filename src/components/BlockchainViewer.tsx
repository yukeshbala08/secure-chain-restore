import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Block } from '@/types/blockchain';
import { Shield, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface BlockchainViewerProps {
  chain: Block[];
  isValid: boolean;
}

export function BlockchainViewer({ chain, isValid }: BlockchainViewerProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Blockchain Evidence Log</CardTitle>
          </div>
          {isValid ? (
            <Badge className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Valid Chain
            </Badge>
          ) : (
            <Badge variant="destructive">Invalid Chain</Badge>
          )}
        </div>
        <CardDescription>
          Tamper-proof evidence preservation using blockchain technology
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chain.slice().reverse().map((block, index) => (
            <div key={block.index} className="relative">
              <div className="border rounded-lg p-4 space-y-3 bg-card hover:bg-accent/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Block #{block.index}</Badge>
                      <Badge 
                        variant={
                          block.data.status === 'success' ? 'default' : 
                          block.data.status === 'partial' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {block.data.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{block.data.fileName}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(block.timestamp).toLocaleString()}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium text-muted-foreground">Operation ID:</span>
                    <p className="font-mono mt-1 break-all">{block.data.operationId}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">File Hash:</span>
                    <p className="font-mono mt-1 break-all bg-muted p-1 rounded">
                      {block.data.fileHash.substring(0, 32)}...
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Block Hash:</span>
                    <p className="font-mono mt-1 break-all bg-muted p-1 rounded">
                      {block.hash.substring(0, 32)}...
                    </p>
                  </div>
                  {block.index > 0 && (
                    <div>
                      <span className="font-medium text-muted-foreground">Previous Hash:</span>
                      <p className="font-mono mt-1 break-all bg-muted p-1 rounded">
                        {block.previousHash.substring(0, 32)}...
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {index < chain.length - 1 && (
                <div className="flex justify-center my-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
