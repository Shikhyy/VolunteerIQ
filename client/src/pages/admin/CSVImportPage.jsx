import { useState, useCallback } from 'react'
import { Upload, FileText, Download, CheckCircle, ArrowRight, X } from 'lucide-react'
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Import<span className="text-[#D6CCC2]">.</span></h1>
        <p className="text-white/50 mt-1">Bulk import tasks from a CSV file</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step >= s ? 'bg-[#D6CCC2] text-[#0A0A0A]' : 'bg-white/[0.1] text-white/40'}
            `}>
              {step > s ? '✓' : s}
            </div>
            {s < 3 && <div className={`w-16 h-px mx-2 ${step > s ? 'bg-[#D6CCC2]' : 'bg-white/[0.1]'}`} />}
          </div>
        ))}
      </div>

      <Card padding="lg" className="min-h-[400px]">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium tracking-wide">Upload CSV File</h2>
            
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`
                border-2 border-dashed rounded-xl p-12 text-center transition-colors
                ${file ? 'border-[#D6CCC2] bg-[#D6CCC2]/5' : 'border-white/10 hover:border-white/20'}
              `}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText size={24} className="text-[#D6CCC2]" />
                  <div className="text-left">
                    <p className="font-medium text-white">{file.name}</p>
                    <p className="text-sm text-white/50">{csvData.length} rows</p>
                  </div>
                  <button onClick={() => { setFile(null); setCsvData([]); setHeaders([]) }} className="p-1 hover:bg-white/10 rounded">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={32} className="mx-auto mb-4 text-white/30" />
                  <p className="text-white/50 mb-2">Drag and drop your CSV file here</p>
                  <p className="text-xs text-white/30 mb-4">or</p>
                  <label className="inline-block">
                    <input type="file" accept=".csv" onChange={handleDrop} className="hidden" />
                    <Button variant="ghost" size="sm">Browse Files</Button>
                  </label>
                </>
              )}
            </div>

            {csvData.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-white/50 tracking-wider uppercase mb-2">Preview</h3>
                <div className="overflow-x-auto border border-white/10 rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-white/[0.02]">
                      <tr>
                        {headers.map((h, i) => (
                          <th key={i} className="px-3 py-2 text-left font-medium text-white/50 border-b border-white/10">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 3).map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} className="px-3 py-2 border-b border-white/5 text-white/70">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <p className="text-xs text-white/30">Need a template?</p>
              <button onClick={handleDownload} className="text-xs text-[#D6CCC2] flex items-center gap-1 hover:underline">
                <Download size={12} /> Download sample CSV
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium tracking-wide">Map Columns</h2>
            <p className="text-sm text-white/50">Map your CSV columns to task fields.</p>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {headers.map((header, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-white/50 truncate">{header}</div>
                  <ArrowRight size={14} className="text-white/30" />
                  <select
                    value={columnMap[header] || ''}
                    onChange={(e) => setColumnMap({ ...columnMap, [header]: e.target.value })}
                    className="flex-1 h-10 px-3 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D6CCC2]/50"
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
            <h2 className="text-lg font-medium tracking-wide">Review & Import</h2>
            
            {importComplete ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Import Complete!</h3>
                <p className="text-white/50 mb-6">{csvData.length} tasks imported successfully</p>
                <Button onClick={() => { setImportComplete(false); setStep(1); setFile(null); setCsvData([]); setHeaders([]); setColumnMap({}) }}>
                  Import More
                </Button>
              </div>
            ) : (
              <>
                <Card className="p-4 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/50">File</span>
                    <span className="text-sm font-medium text-white">{file?.name}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/50">Rows</span>
                    <span className="text-sm font-medium text-white">{csvData.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Columns mapped</span>
                    <span className="text-sm font-medium text-white">{Object.keys(columnMap).length}</span>
                  </div>
                </Card>

                <Button className="w-full bg-[#D6CCC2] text-[#0A0A0A]" onClick={handleImport} disabled={importing}>
                  {importing ? 'IMPORTING...' : `IMPORT ${csvData.length} TASKS`}
                </Button>
              </>
            )}
          </div>
        )}

        {!importComplete && (
          <div className="flex justify-between pt-4 border-t border-white/[0.06]">
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1}>
              BACK
            </Button>
            {step < 3 && (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                CONTINUE
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}