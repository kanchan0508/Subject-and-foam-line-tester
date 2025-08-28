import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Loader2, ClipboardCopy, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { useSubjectAnalysis } from "@/hooks/useSubjectAnalysis";
import { History } from "@/hooks/History";

export default function SubjectLineTester() {
  const { analyze } = useSubjectAnalysis();
  const [subject, setSubject] = useState("");
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<{ score: number; feedback: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ subject: string; preview: string }[]>([]);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Analyze subject line (simulate API)
  const checkSubject = async () => {
    if (!subject.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await analyze(subject);
    setResult(res);
    setLoading(false);
    setHistory(prev => {
      const newItem = { subject, preview };
      const filtered = prev.filter(item => item.subject !== subject);
      return [newItem, ...filtered].slice(0, 5);
    });
  };

  // Copy preview text
  const copyPreview = async () => {
    try {
      await navigator.clipboard.writeText(`${subject}\n${preview}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Reset form
  const resetForm = () => {
    setSubject("");
    setPreview("");
    setResult(null);
  };

  // Reuse from history
  const reuseHistory = (item: { subject: string; preview: string }) => {
    setSubject(item.subject);
    setPreview(item.preview);
    setResult(null);
  };

  // Badge color for spam score
  const getScoreBadge = (score: number) => {
    if (score <= 2) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (score <= 4) return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    return "bg-red-500/20 text-red-300 border-red-500/30";
  };

  const getResultColors = (score: number) => {
    if (score > 4) return "bg-red-500/10 border-red-500/20";
    return "bg-emerald-500/10 border-emerald-500/20";
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-start px-4 py-6 sm:py-8 lg:py-12 font-sans relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Header */}
        <header className="mb-6 sm:mb-8 lg:mb-12 flex flex-col items-center z-10 text-center max-w-4xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight mb-3 sm:mb-4">
            Subject & Foam Line Tester
          </h1>
          <p className="text-slate-400 text-sm sm:text-base lg:text-lg font-medium max-w-2xl px-4">
            Craft compelling subject lines and preview text to boost open rates and avoid spam filters.
          </p>
          <div className="w-12 sm:w-16 h-0.5 mt-3 sm:mt-4 rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 opacity-60"></div>
        </header>

        {/* Main Card */}
        <Card className="w-full max-w-2xl bg-slate-800/90 backdrop-blur-lg shadow-2xl rounded-2xl sm:rounded-3xl border border-slate-700/50 animate-slideUp z-10">
          <CardContent className="space-y-5 sm:space-y-6 lg:space-y-7 p-4 sm:p-6 lg:p-8">
            
            {/* Subject Line Input */}
            <div className="space-y-2 sm:space-y-3">
              <label htmlFor="subject" className="block font-semibold text-slate-200 text-sm sm:text-base">
                Subject Line
              </label>
              <Input
                id="subject"
                placeholder="Enter your email subject line..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                aria-label="Email subject line"
                autoFocus
                className="w-full h-11 sm:h-12 text-sm sm:text-base bg-slate-900/70 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 rounded-lg sm:rounded-xl"
                onKeyDown={(e) => e.key === 'Enter' && !loading && subject.trim() && checkSubject()}
              />
            </div>

            {/* Preview Text Input */}
            <div className="space-y-2 sm:space-y-3">
              <label htmlFor="preview" className="block font-semibold text-slate-200 text-sm sm:text-base">
                Preview Text
              </label>
              <Textarea
                id="preview"
                placeholder="Enter preview text (optional, shown in inbox preview)"
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
                aria-label="Preview text"
                className="w-full min-h-[80px] sm:min-h-[100px] text-sm sm:text-base bg-slate-900/70 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 resize-none rounded-lg sm:rounded-xl"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full">
              <Button
                onClick={checkSubject}
                className="flex-1 h-11 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !subject.trim()}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  "Analyze Subject Line"
                )}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                title="Reset form"
                aria-label="Reset form"
                disabled={loading}
                className="h-11 sm:h-12 w-11 sm:w-12 p-0 flex items-center justify-center bg-slate-700/50 hover:bg-slate-600/70 border border-slate-600/50 hover:border-slate-500/70 text-slate-300 hover:text-white transition-all duration-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-300" />
              </Button>
            </div>

            {/* Results Section */}
            {result && (
              <div className="space-y-4 sm:space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-200">
                    Analysis Results
                  </h2>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border ${getScoreBadge(result.score)}`}>
                    Spam Score: {result.score}/10
                  </span>
                </div>

                <div className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 ${getResultColors(result.score)}`}>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    {result.score > 4 ? (
                      <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 flex-shrink-0" />
                    )}
                    <h3 className="font-bold text-slate-200 text-sm sm:text-base">
                      {result.score > 4 ? "Needs Improvement" : "Looking Good!"}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {result.feedback.map((item, index) => (
                      <li key={index} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                        <span className="w-1 h-1 bg-slate-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inbox Preview */}
                <div className="p-4 sm:p-5 bg-slate-900/50 rounded-xl sm:rounded-2xl border border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-300">
                      📧 Inbox Preview
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyPreview}
                      aria-label="Copy preview"
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 rounded-lg px-2 sm:px-3 py-1 sm:py-2"
                    >
                      <ClipboardCopy className="w-3 h-3 sm:w-4 sm:h-4" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="font-semibold text-slate-200 text-sm sm:text-base leading-tight">
                      {subject || "No subject"}
                    </p>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {preview || "No preview text"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* History Section */}
            {history.length > 0 && (
              <div className="border-t border-slate-700/50 pt-4 sm:pt-6">
                <button
                  className="flex items-center gap-2 text-slate-400 hover:text-slate-200 font-medium text-sm sm:text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-lg px-2 py-1"
                  onClick={() => setShowHistory(!showHistory)}
                  aria-expanded={showHistory}
                  aria-controls="history-list"
                >
                  {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showHistory ? "Hide" : "Show"} History ({history.length})
                </button>
                <div 
                  id="history-list" 
                  className={`overflow-hidden transition-all duration-300 ${showHistory ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"}`}
                >
                  <History items={history} onSelect={reuseHistory} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Animations */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          .font-sans { 
            font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; 
          }
          .animate-slideUp { 
            animation: slideUp 0.6s ease-out; 
          }
          .animate-fadeIn { 
            animation: fadeIn 0.5s ease-out; 
          }
          @keyframes slideUp {
            from { 
              opacity: 0; 
              transform: translateY(30px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          @keyframes fadeIn {
            from { 
              opacity: 0; 
              transform: translateY(20px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          body { 
            background: #0f172a; 
          }
        `}
      </style>
    </>
  );
}
