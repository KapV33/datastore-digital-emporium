import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Product } from "./ProductTable";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onProductsAdded: (products: Product[]) => void;
  onClose: () => void;
}

export const FileUploader = ({ onProductsAdded, onClose }: FileUploaderProps) => {
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setParsedData(results.data as any[]);
          setIsUploading(false);
        },
        error: (error) => {
          toast({
            title: "Error parsing CSV",
            description: error.message,
            variant: "destructive",
          });
          setIsUploading(false);
        }
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          setParsedData(jsonData);
          setIsUploading(false);
        } catch (error) {
          toast({
            title: "Error parsing Excel file",
            description: "Failed to parse the Excel file",
            variant: "destructive",
          });
          setIsUploading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast({
        title: "Unsupported file type",
        description: "Please upload a CSV or Excel file",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const handleConfirmUpload = () => {
    if (parsedData.length === 0) return;

    try {
      const products: Product[] = parsedData.map((row, index) => ({
        id: row.id || `uploaded-${Date.now()}-${index}`,
        name: row.name || row.title || `Database ${index + 1}`,
        description: row.description || row.desc || "No description provided",
        price: parseFloat(row.price) || 0.001,
        category: row.category || "General",
        size: row.size || "Unknown",
        format: row.format || "CSV",
        records: parseInt(row.records) || 0,
      }));

      onProductsAdded(products);
      
      toast({
        title: "Upload successful",
        description: `Added ${products.length} products to the database`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error processing data",
        description: "Failed to process the uploaded data",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Upload Product Database</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* File Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-primary">Drop the file here...</p>
          ) : (
            <div>
              <p className="text-foreground mb-2">
                Drag & drop a CSV or Excel file here, or click to select
              </p>
              <p className="text-sm text-muted-foreground">
                Supported formats: .csv, .xlsx, .xls
              </p>
            </div>
          )}
        </div>

        {/* File Info */}
        {fileName && (
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
            <span className="flex-1">{fileName}</span>
            {isUploading ? (
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <CheckCircle className="h-5 w-5 text-shop-success" />
            )}
          </div>
        )}

        {/* Expected Format Guide */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Expected CSV/Excel Format:</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Required columns:</strong> name, price</p>
            <p><strong>Optional columns:</strong> description, category, size, format, records</p>
            <p><strong>Example:</strong> name, description, price, category, size, format, records</p>
          </div>
        </div>

        {/* Preview */}
        {parsedData.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">Preview ({parsedData.length} rows)</h3>
            <div className="max-h-40 overflow-auto border rounded">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {Object.keys(parsedData[0] || {}).map(key => (
                      <th key={key} className="p-2 text-left border-r">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 3).map((row, index) => (
                    <tr key={index} className="border-t">
                      {Object.values(row).map((value: any, valueIndex) => (
                        <td key={valueIndex} className="p-2 border-r">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmUpload} 
            disabled={parsedData.length === 0 || isUploading}
            className="flex-1"
          >
            Add {parsedData.length} Products
          </Button>
        </div>
      </div>
    </Card>
  );
};