import { useState, useCallback } from 'react'
import { Upload, FileText, Download, AlertCircle, CheckCircle, ArrowRight, X } from 'lucide-react'
import { Card, Button } from '../../components/ui'

const sampleCSV = `title,description,category,urgency,address,city,slots_needed
Medical camp setup,Set up a 50-bed medical camp,Medical,5,Okhla Industrial Area,Delhi,8
Food distribution,Distribute food packets,Logistics,4,Rohini Sector 15,Delhi,6
Elderly care,Assist elderly residents,Admin,2,Janakpuri,Delhi,3`

const columnOptions = [
  { value: 'title', label: 'Task Title' },
  { value: 'description', label: 'Description' },
  { value: 'category', label: 'Category' },
  { value: 'urgency', label: 'Urgency (1-5)' },
  { value: 'address', label: 'Address' },
  { value: 'city', label: 'City' },
  { value: 'district', label: 'District' },
  { value: 'slots_needed', label: 'Slots Needed' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'skip', label: 'Skip Column' },
]

export default function CSVImportPage() {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState(null)
  const [csvData, setCsvData] = useState([])
  const [headers, setHeaders] = useState([])
  const [columnMap, setColumnMap] = useState({})
  const [errors, setErrors] = useState([])
  const [importing, setImporting] = useState(false)
  const [importComplete, setImportComplete] = useState(false)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0] || e.target.files[0]
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile)
      parseCSV(droppedFile)
    }
  }, [])

  const parseCSV = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const lines = text.split('\n').filter(l => l.trim())
      const firstLine = lines[0]
      const detectedHeaders = firstLine.split(',').map(h => h.trim())
      setHeaders(detectedHeaders)
      setCsvData(lines.slice(1).map(line => line.split(',')))
    }
    reader.readAsText(file)
  }

  const handleDownload = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample-tasks.csv'
    a.click()
  }

  const handleImport = async () => {
    setImporting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setImportComplete(true)
    setImporting(false)
  }

  const canProceed = () => {
    if (step === 1) return file && csvData.length > 0
    if (step === 2) return Object.keys(columnMap).length > 0
    return true
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Import Tasks</h1>
        <p className="text-[#6B6B6B]">Bulk import tasks from a CSV file.</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step >= s ? 'bg-[#D6CCC2] text-[#1A1A1A]' : 'bg-[#F5F5F5] text-[#9CA3AF]'}
            `}>
              {step > s ? '✓' : s}
            </div>
            {s < 3 && <div className={`w-16 h-0.5 mx-2 ${step > s ? 'bg-[#D6CCC2]' : 'bg-[#E5E5E5]'}`} />}
          </div>
        ))}
      </div>

      <Card padding="lg" className="min-h-[400px]">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Upload CSV File</h2>
            
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`
                border-2 border-dashed rounded-xl p-12 text-center transition-colors
                ${file ? 'border-[#D6CCC2] bg-[#EDEDE9]' : 'border-[#E5E5E5] hover:border-[#D6CCC2]'}
              `}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText size={24} className="text-[#1A1A1A]" />
                  <div className="text-left">
                    <p className="font-medium text-[#1A1A1A]">{file.name}</p>
                    <p className="text-sm text-[#6B6B6B]">{csvData.length} rows</p>
                  </div>
                  <button onClick={() => { setFile(null); setCsvData([]); setHeaders([]) }} className="p-1 hover:bg-[#F5F5F5] rounded">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={32} className="mx-auto mb-4 text-[#9CA3AF]" />
                  <p className="text-[#6B6B6B] mb-2">Drag and drop your CSV file here</p>
                  <p className="text-sm text-[#9CA3AF] mb-4">or</p>
                  <label className="inline-block">
                    <input type="file" accept=".csv" onChange={handleDrop} className="hidden" />
                    <Button variant="secondary" size="sm">Browse Files</Button>
                  </label>
                </>
              )}
            </div>

            {/* Preview */}
            {csvData.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-2">Preview ({csvData.slice(0, 3).length} rows shown)</h3>
                <div className="overflow-x-auto border border-[#E5E5E5] rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-[#FAFAFA]">
                      <tr>
                        {headers.map((h, i) => (
                          <th key={i} className="px-3 py-2 text-left font-medium text-[#6B6B6B] border-b">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 3).map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} className="px-3 py-2 border-b">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sample Download */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
              <p className="text-sm text-[#9CA3AF]">Need a template?</p>
              <button onClick={handleDownload} className="text-sm text-[#1A1A1A] flex items-center gap-1 hover:underline">
                <Download size={14} /> Download sample CSV
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Map Columns</h2>
            <p className="text-sm text-[#6B6B6B]">Map your CSV columns to task fields.</p>
            
            <div className="space-y-3">
              {headers.map((header, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-[#6B6B6B]">{header}</div>
                  <ArrowRight size={16} className="text-[#9CA3AF]" />
                  <select
                    value={columnMap[header] || ''}
                    onChange={(e) => setColumnMap({ ...columnMap, [header]: e.target.value })}
                    className="flex-1 h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-2 focus:border-[#D6CCC2]"
                  >
                    <option value="">Select field...</option>
                    {columnOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Review & Import</h2>
            
            {importComplete ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Import Complete!</h3>
                <p className="text-[#6B6B6B]">{csvData.length} tasks imported successfully</p>
                <Button variant="primary" className="mt-6" onClick={() => { setImportComplete(false); setStep(1); setFile(null); setCsvData([]); setHeaders([]); setColumnMap({}) }}>
                  Import More
                </Button>
              </div>
            ) : (
              <>
                <div className="p-4 bg-[#FAFAFA] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#6B6B6B]">File</span>
                    <span className="text-sm font-medium text-[#1A1A1A]">{file?.name}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#6B6B6B]">Rows</span>
                    <span className="text-sm font-medium text-[#1A1A1A]">{csvData.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B6B6B]">Columns mapped</span>
                    <span className="text-sm font-medium text-[#1A1A1A]">{Object.keys(columnMap).length}</span>
                  </div>
                </div>

                <Button variant="primary" className="w-full" onClick={handleImport} disabled={importing}>
                  {importing ? 'Importing...' : `Import ${csvData.length} Tasks`}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Navigation */}
        {!importComplete && (
          <div className="flex justify-between pt-4 border-t border-[#E5E5E5]">
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1}>
              Back
            </Button>
            {step < 3 && (
              <Button variant="primary" onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Continue
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}