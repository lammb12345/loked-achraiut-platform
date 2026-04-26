import { useState } from 'react'
import { syncSchoolerToSupabase, type SyncProgress } from '@/lib/syncSchooler'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle2, AlertCircle, DatabaseZap } from 'lucide-react'

export default function AdminSync() {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<SyncProgress | null>(null)
  const [result, setResult] = useState<{ courses: number; students: number; lessons: number; enrollments: number } | null>(null)
  const [failed, setFailed] = useState(false)

  async function runSync() {
    setRunning(true)
    setResult(null)
    setFailed(false)
    try {
      const res = await syncSchoolerToSupabase((p) => setProgress({ ...p }))
      setResult(res)
    } catch (e: any) {
      setProgress(p => p ? { ...p, errors: [...(p.errors ?? []), e.message] } : null)
      setFailed(true)
    } finally {
      setRunning(false)
    }
  }

  const pct = progress && progress.total > 0
    ? Math.round((progress.done / progress.total) * 100)
    : 0

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <DatabaseZap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">סנכרון מ-Schooler</h2>
          <p className="text-sm text-muted-foreground">מושך קורסים, שיעורים ותלמידים לתוך מסד הנתונים</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
        <div className="text-sm text-muted-foreground space-y-1.5">
          <p>הסנכרון יבצע <strong>upsert</strong> לפי schooler_id — ריצה כפולה לא יוצרת כפילויות.</p>
          <p>קורסים קיימים ב-Supabase <strong>לא יימחקו</strong>.</p>
        </div>

        <Button onClick={runSync} disabled={running} className="gap-2 w-full">
          <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
          {running ? 'מסנכרן...' : 'התחל סנכרון'}
        </Button>

        {progress && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-primary">{progress.stage}</p>

            {progress.total > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progress.done} / {progress.total}</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )}

            {progress.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-1 max-h-32 overflow-y-auto">
                {progress.errors.map((e, i) => (
                  <p key={i} className="text-xs text-red-700 flex gap-2">
                    <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                    {e}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {result && !running && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-700">הסנכרון הושלם</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'קורסים', value: result.courses },
                { label: 'שיעורים', value: result.lessons },
                { label: 'תלמידים', value: result.students },
                { label: 'הרשמות', value: result.enrollments },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-lg p-3 text-center border border-green-100">
                  <p className="text-2xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {failed && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            הסנכרון נכשל — בדוק את הקונסול
          </div>
        )}
      </div>
    </div>
  )
}
