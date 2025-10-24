import { useState } from 'react';
import { Upload, FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface FileUploadProps {
  onFileSelect: (file: File, corruptionLevel: number) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [corruptionLevel, setCorruptionLevel] = useState<number>(30);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileSelect(selectedFile, corruptionLevel);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload File for Recovery Simulation</CardTitle>
        <CardDescription>
          Upload a file to simulate a cyberattack and test recovery capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="flex items-center justify-center gap-2">
              <FileIcon className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">Drag and drop your file here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
            </div>
          )}
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            accept=".txt,.pdf,.doc,.docx,.jpg,.png"
          />
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Select File
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Corruption Level: {corruptionLevel}%</Label>
            </div>
            <Slider
              value={[corruptionLevel]}
              onValueChange={(value) => setCorruptionLevel(value[0])}
              min={10}
              max={80}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Simulates the severity of data corruption in the cyberattack
            </p>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedFile}
          className="w-full"
          size="lg"
        >
          Start Recovery Process
        </Button>
      </CardContent>
    </Card>
  );
}
