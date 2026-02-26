import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download, Eye, File, FileImage } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentsTabProps {
  documents: any[];
}

// Sample documents for demonstration
const sampleDocuments = [
  { id: '1', document_name: 'passport.pdf', document_type: 'passport', uploaded_at: '2024-09-01T10:00:00Z' },
  { id: '2', document_name: 'birth_certificate.jpg', document_type: 'certificate', uploaded_at: '2024-09-01T10:05:00Z' },
  { id: '3', document_name: 'contract_2024.pdf', document_type: 'contract', uploaded_at: '2024-09-01T10:10:00Z' },
];

const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'passport':
    case 'contract':
      return <FileText className="w-5 h-5 text-primary" />;
    case 'certificate':
    case 'photo':
      return <FileImage className="w-5 h-5 text-primary" />;
    default:
      return <File className="w-5 h-5 text-primary" />;
  }
};

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents }) => {
  const data = documents && documents.length > 0 ? documents : sampleDocuments;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Documents</h3>
        <Button size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {data.length > 0 ? (
        <div className="space-y-3">
          {data.map((doc: any) => (
            <div key={doc.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-background rounded-lg">
                  {getDocumentIcon(doc.document_type)}
                </div>
                <div>
                  <p className="font-medium">{doc.document_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded: {format(new Date(doc.uploaded_at), 'dd.MM.yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{doc.document_type}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">No documents uploaded</p>
      )}
    </Card>
  );
};
