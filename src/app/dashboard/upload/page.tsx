'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  Brain,
  AlertCircle,
  Zap,
  Coins,
  RotateCcw,
} from 'lucide-react'
import toast from 'react-hot-toast'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
}

type UploadState = 'idle' | 'uploading' | 'analyzing' | 'done' | 'error'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const TIPS = [
  'Use a clean, single-column format for best ATS compatibility',
  'Include specific metrics (e.g., "Increased sales by 40%") in experience',
  'Make sure your contact info includes LinkedIn URL and phone number',
  'A professional summary at the top boosts your score significantly',
  'PDF format preserves formatting better than DOCX across all systems',
]

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [state, setState] = useState<UploadState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(
    (accepted: File[], rejected: { errors: { message: string }[] }[]) => {
      if (rejected.length > 0) {
        const msg =
          rejected[0].errors[0]?.message ||
          'Invalid file. Use PDF or DOCX under 5MB.'
        toast.error(msg)
        return
      }
      if (accepted[0]) {
        setFile(accepted[0])
        setError(null)
        setState('idle')
      }
    },
    []
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    maxFiles: 1,
    disabled: state === 'uploading' || state === 'analyzing',
  })

  const handleAnalyze = async () => {
    if (!file) return
    setState('uploading')
    setError(null)
    setProgress(10)

    try {
      // Animate progress
      const tick = setInterval(() => {
        setProgress((p) => (p < 60 ? p + 8 : p))
      }, 300)

      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(tick)
      setProgress(65)

      if (!uploadRes.ok) {
        const d = await uploadRes.json()
        throw new Error(d.error || 'Upload failed')
      }

      const { resumeId } = await uploadRes.json()
      setState('analyzing')
      setProgress(75)

      const analysisRes = await fetch('/api/analysis/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId }),
      })

      setProgress(95)

      if (!analysisRes.ok) {
        const d = await analysisRes.json()
        throw new Error(d.error || 'Analysis failed')
      }

      const { analysisId } = await analysisRes.json()
      setProgress(100)
      setState('done')
      toast.success('Analysis complete!')
      setTimeout(() => router.push(`/analysis/${analysisId}`), 800)
    } catch (err) {
      setState('error')
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      toast.error(msg)
      setProgress(0)
    }
  }

  const reset = () => {
    setFile(null)
    setState('idle')
    setError(null)
    setProgress(0)
  }

  const isProcessing = state === 'uploading' || state === 'analyzing'

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold">Analyze Resume</h1>
        <p className="text-white/40 text-sm mt-1">
          Upload your PDF or DOCX resume. Uses 1 credit per analysis.
        </p>
      </div>

      {/* Credit Warning */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-sm">
        <Coins className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <span className="text-amber-300/80">
          Each analysis uses <strong className="text-amber-400">1 credit</strong>.
          Need more?{' '}
          <a href="/dashboard/wallet" className="text-amber-400 hover:underline">
            Buy credits →
          </a>
        </span>
      </div>

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        id="resume-dropzone"
        role="button"
        tabIndex={0}
        aria-label="Upload resume file — drag and drop or click to browse"
        className={[
          'upload-zone select-none',
          isDragActive ? 'drag-active' : '',
          file ? '!border-emerald-500/40 !bg-emerald-500/5' : '',
          isProcessing ? '!cursor-not-allowed pointer-events-none opacity-70' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input {...getInputProps()} id="resume-file-input" aria-label="Choose resume file" />

        {file ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-emerald-400 break-all px-4">{file.name}</div>
              <div className="text-sm text-white/40 mt-1">
                {formatBytes(file.size)} ·{' '}
                {file.type.includes('pdf') ? 'PDF' : 'DOCX'}
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isDragActive ? 'bg-brand-500/30 scale-110' : 'bg-brand-500/10'
              }`}
            >
              {isDragActive ? (
                <Zap className="w-7 h-7 text-brand-400" />
              ) : (
                <Upload className="w-7 h-7 text-white/30" />
              )}
            </div>
            <div className="text-center px-4">
              <p className="font-semibold text-white/70 text-sm sm:text-base">
                {isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}
              </p>
              <p className="text-sm text-white/30 mt-1">
                or{' '}
                <span className="text-brand-400 font-medium">click to browse</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-white/25">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> PDF, DOCX
              </span>
              <span>·</span>
              <span>Max 5 MB</span>
            </div>
          </>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Progress */}
      {isProcessing && (
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-3">
            {state === 'uploading' ? (
              <Loader2 className="w-4 h-4 text-brand-400 animate-spin flex-shrink-0" />
            ) : (
              <Brain className="w-4 h-4 text-purple-400 animate-pulse flex-shrink-0" />
            )}
            <span className="text-sm font-medium flex-1">
              {state === 'uploading' ? 'Uploading resume…' : 'AI analyzing your resume…'}
            </span>
            <span className="text-sm text-white/40 tabular-nums">{progress}%</span>
          </div>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
                background:
                  state === 'analyzing'
                    ? 'linear-gradient(135deg, #8b5cf6, #4f5eff)'
                    : 'linear-gradient(135deg, #4f5eff, #06b6d4)',
              }}
            />
          </div>
          {state === 'analyzing' && (
            <p className="text-xs text-white/30">
              GPT-4o is reading every section of your resume. This takes 15–30 seconds.
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {file && !isProcessing && state !== 'done' && (
          <>
            <button
              id="analyze-submit-btn"
              onClick={handleAnalyze}
              className="btn-primary flex-1 justify-center"
            >
              <Brain className="w-4 h-4" />
              Analyze with AI — 1 Credit
            </button>
            <button
              id="analyze-reset-btn"
              onClick={reset}
              className="btn-secondary px-4"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}

        {!file && !isProcessing && (
          <button
            onClick={() => document.getElementById('resume-file-input')?.click()}
            className="btn-secondary w-full justify-center"
          >
            <Upload className="w-4 h-4" />
            Select File
          </button>
        )}

        {state === 'error' && file && (
          <button onClick={reset} className="btn-ghost flex-1 justify-center">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          💡 Tips for Best Results
        </h3>
        <ul className="space-y-2 text-sm text-white/50">
          {TIPS.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-brand-400 flex-shrink-0 font-bold">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
