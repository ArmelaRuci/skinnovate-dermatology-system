import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { analysisApi, appointmentsApi } from '../../services/api'
import DashboardLayout from '../../components/common/DashboardLayout'
import { Card, Button, SectionTitle, Empty } from '../../components/common/UI'
import Spinner from '../../components/common/Spinner'
import { Upload, Brain, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import styles from './AIAnalysisPage.module.css'

function ConfidenceBar({ score }) {
  const pct = Math.round(score * 100)
  const color = pct >= 70 ? 'var(--teal)' : pct >= 50 ? 'var(--gold)' : 'var(--rose)'
  return (
    <div className={styles.confBarWrap}>
      <div className={styles.confBarLabel}>
        <span>Confidence</span><span style={{ color }}>{pct}%</span>
      </div>
      <div className={styles.confBarBg}>
        <div className={styles.confBarFill} style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

function DiagnosisResult({ result, onBookConsultation }) {
  const [showAll, setShowAll] = useState(false)
  const diag = result.diagnosis
  const isLowConf = diag.confidence_score < 0.70
  const isHigh    = diag.severity === 'high'

  return (
    <div className={styles.resultWrap}>
      {/* Condition header */}
      <div className={styles.resultHeader}>
        <div className={styles.resultIcon}>
          {isHigh || isLowConf
            ? <AlertTriangle size={28} color="var(--gold)" />
            : <CheckCircle size={28} color="var(--teal)" />
          }
        </div>
        <div>
          <div className={styles.conditionBig}>{diag.predicted_condition}</div>
          <div className={styles.resultSub}>AI Preliminary Diagnosis</div>
        </div>
        <div className={styles.severityPill}>
          <span className={`badge badge-${diag.severity === 'high' ? 'danger' : diag.severity === 'medium' ? 'gold' : 'teal'}`}>
            {diag.severity} severity
          </span>
        </div>
      </div>

      <ConfidenceBar score={diag.confidence_score} />

      {/* Warning banners */}
      {isLowConf && (
        <div className={styles.warnBanner}>
          <AlertTriangle size={16} />
          <div>
            <strong>Low confidence result.</strong> The AI is not certain about this diagnosis.
            A dermatologist consultation is strongly recommended.
          </div>
        </div>
      )}
      {isHigh && (
        <div className={`${styles.warnBanner} ${styles.warnDanger}`}>
          <AlertTriangle size={16} />
          <div>
            <strong>High severity condition detected.</strong> Please book a consultation immediately
            for professional evaluation.
          </div>
        </div>
      )}

      {/* Top predictions */}
      <div className={styles.predictionsBox}>
        <button className={styles.predictToggle} onClick={() => setShowAll(p => !p)}>
          All predictions {showAll ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
        </button>
        {showAll && diag.all_predictions?.map((p, i) => (
          <div key={i} className={styles.predRow}>
            <span className={styles.predLabel}>{p.condition}</span>
            <div className={styles.predBarWrap}>
              <div className={styles.predBar} style={{ width: `${Math.round(p.score * 100)}%` }} />
            </div>
            <span className={styles.predScore}>{Math.round(p.score * 100)}%</span>
          </div>
        ))}
      </div>

      {/* Validation status */}
      <div className={styles.validRow}>
        <Clock size={14} />
        <span>Awaiting dermatologist review</span>
      </div>

      {/* Book consultation */}
      {(isLowConf || isHigh || diag.requires_consultation) && (
        <Button fullWidth variant="gold" icon={<Brain size={16}/>} onClick={onBookConsultation} style={{ marginTop: 8 }}>
          Book Consultation
        </Button>
      )}
    </div>
  )
}

export default function AIAnalysisPage() {
  const [file,        setFile]       = useState(null)
  const [preview,     setPreview]    = useState(null)
  const [description, setDesc]       = useState('')
  const [bodyArea,    setBodyArea]   = useState('')
  const [analyzing,   setAnalyzing]  = useState(false)
  const [result,      setResult]     = useState(null)
  const [history,     setHistory]    = useState([])
  const [histLoading, setHistLoad]   = useState(true)
  const [booking,     setBooking]    = useState(false)

  // Load history on mount
  useState(() => {
    analysisApi.history()
      .then(r => setHistory(r.data.data || []))
      .catch(() => {})
      .finally(() => setHistLoad(false))
  }, [])

  const onDrop = useCallback(accepted => {
    if (!accepted[0]) return
    setFile(accepted[0])
    setPreview(URL.createObjectURL(accepted[0]))
    setResult(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 16 * 1024 * 1024,
  })

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please select an image first'); return }
    setAnalyzing(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      if (description) fd.append('description', description)
      if (bodyArea)    fd.append('body_area', bodyArea)
      const res = await analysisApi.upload(fd)
      setResult(res.data.data)
      setHistory(h => [res.data.data, ...h])
      toast.success('Analysis complete!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleReset = () => {
    setFile(null); setPreview(null); setResult(null); setDesc(''); setBodyArea('')
  }

  const handleBookConsultation = async () => {
    setBooking(true)
    try {
      await appointmentsApi.book({
        scheduled_at: new Date(Date.now() + 48 * 3600000).toISOString(),
        appointment_type: 'in_person',
        reason: `AI analysis follow-up: ${result?.diagnosis?.predicted_condition}`,
      })
      toast.success('Consultation request sent!')
    } catch {
      toast.error('Could not book consultation. Please try from the Appointments page.')
    } finally {
      setBooking(false)
    }
  }

  return (
    <DashboardLayout
      title="AI Skin Analysis"
      subtitle="Upload a skin image for instant AI-powered diagnosis"
    >
      <div className={styles.layout}>
        {/* Upload panel */}
        <div className={styles.uploadPanel}>
          <Card>
            <SectionTitle sub="JPG, PNG or WebP · max 16 MB">Upload Image</SectionTitle>

            <div
              {...getRootProps()}
              className={`${styles.dropzone} ${isDragActive ? styles.dropActive : ''} ${preview ? styles.dropHasFile : ''}`}
            >
              <input {...getInputProps()} />
              {preview
                ? <img src={preview} alt="preview" className={styles.preview} />
                : <div className={styles.dropPlaceholder}>
                    <Upload size={36} color="var(--teal)" />
                    <p>{isDragActive ? 'Drop it here' : 'Drag & drop or click to select'}</p>
                    <span>Supports JPG, PNG, WebP</span>
                  </div>
              }
            </div>

            {preview && (
              <div className={styles.metaFields}>
                <input
                  className={styles.metaInput}
                  placeholder="Description (optional)"
                  value={description}
                  onChange={e => setDesc(e.target.value)}
                />
                <input
                  className={styles.metaInput}
                  placeholder="Body area (e.g. left cheek)"
                  value={bodyArea}
                  onChange={e => setBodyArea(e.target.value)}
                />
              </div>
            )}

            <div className={styles.uploadActions}>
              {preview && !result && (
                <>
                  <Button onClick={handleAnalyze} loading={analyzing} icon={<Brain size={16}/>} fullWidth>
                    {analyzing ? 'Analyzing…' : 'Run AI Analysis'}
                  </Button>
                  <Button variant="ghost" onClick={handleReset} size="sm">Clear</Button>
                </>
              )}
              {result && (
                <Button variant="secondary" onClick={handleReset} fullWidth>Analyze Another Image</Button>
              )}
            </div>
          </Card>

          {/* Result card */}
          {result && (
            <Card className={styles.resultCard}>
              <DiagnosisResult result={result} onBookConsultation={handleBookConsultation} />
            </Card>
          )}
        </div>

        {/* History panel */}
        <div className={styles.historyPanel}>
          <SectionTitle sub="All your previous analyses">Analysis History</SectionTitle>
          {histLoading
            ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner /></div>
            : history.length === 0
            ? <Empty icon="🔬" title="No analyses yet" description="Your AI analysis history will appear here." />
            : <div className={styles.histList}>
                {history.map(item => (
                  <Card key={item.id} className={styles.histItem}>
                    <div className={styles.histTop}>
                      <div className={styles.histCond}>{item.diagnosis?.predicted_condition || '—'}</div>
                      <div className={styles.histDate}>{format(new Date(item.uploaded_at), 'MMM d, yyyy')}</div>
                    </div>
                    <div className={styles.histMeta}>
                      {item.body_area && <span>{item.body_area}</span>}
                      {item.diagnosis && (
                        <>
                          <span className={`badge badge-${item.diagnosis.severity === 'high' ? 'danger' : item.diagnosis.severity === 'medium' ? 'gold' : 'teal'}`}>
                            {item.diagnosis.severity}
                          </span>
                          <span className={styles.histConf}>
                            {Math.round(item.diagnosis.confidence_score * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                    {item.diagnosis?.doctor_confirmed === true && (
                      <div className={styles.histValidated}>
                        <CheckCircle size={12} /> Doctor validated · {item.diagnosis.doctor_diagnosis || item.diagnosis.predicted_condition}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
          }
        </div>
      </div>
    </DashboardLayout>
  )
}
