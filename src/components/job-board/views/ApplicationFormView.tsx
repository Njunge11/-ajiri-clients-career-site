"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, UploadCloud } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import type { Job, ScreeningQuestion, ApplicationData } from '../types'
import { SAMPLE_SCREENING_QUESTIONS } from '../constants'

interface ApplicationFormViewProps {
  job: Job
  mode: 'preview' | 'draft' | 'live'
  onClose: () => void
  onSubmit: (data: ApplicationData) => void
}

export const ApplicationFormView: React.FC<ApplicationFormViewProps> = ({
  job,
  mode,
  onClose,
  onSubmit,
}) => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [linkedinUrl, setLinkedinUrl] = useState('')

  const questions: ScreeningQuestion[] = mode === 'preview'
    ? SAMPLE_SCREENING_QUESTIONS
    : (job.screeningQuestions || [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (mode !== 'live') {
      onSubmit({ answers })
      return
    }

    onSubmit({
      answers,
      linkedinUrl: linkedinUrl || undefined,
    })
  }

  const setAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const toggleMultiAnswer = (questionId: string, value: string) => {
    setAnswers(prev => {
      const current = (prev[questionId] as string[]) || []
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return { ...prev, [questionId]: updated }
    })
  }

  const renderQuestion = (q: ScreeningQuestion, index: number) => {
    return (
      <div key={q.id} className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {index + 1}. {q.question}
          {q.required && <span className="text-red-500 ml-1">*</span>}
          {q.type === 'multi_select' && (
            <span className="text-gray-400 text-xs ml-2 font-normal">(Select all that apply)</span>
          )}
        </label>

        {q.type === 'yes_no' && (
          <RadioGroup
            value={(answers[q.id] as string) || ''}
            onValueChange={(value) => setAnswer(q.id, value)}
            className="flex gap-6"
          >
            {['Yes', 'No'].map((option) => (
              <label key={option} className="flex cursor-pointer items-center gap-2">
                <RadioGroupItem value={option} className="border-gray-300 text-gray-900" />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </RadioGroup>
        )}

        {q.type === 'single_select' && q.options && (
          <RadioGroup
            value={(answers[q.id] as string) || ''}
            onValueChange={(value) => setAnswer(q.id, value)}
            className="flex flex-col gap-2"
          >
            {q.options.map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-2">
                <RadioGroupItem value={opt} className="border-gray-300 text-gray-900" />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </RadioGroup>
        )}

        {q.type === 'multi_select' && q.options && (
          <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-2">
            {q.options.map((opt) => {
              const selected = (answers[q.id] as string[]) || []
              const isSelected = selected.includes(opt)
              return (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-center gap-3 p-3 border rounded transition-colors ${
                    isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleMultiAnswer(q.id, opt)}
                    className="border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              )
            })}
          </div>
        )}

        {q.type === 'short_text' && (
          <input
            type="text"
            value={(answers[q.id] as string) || ''}
            onChange={(e) => setAnswer(q.id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
            placeholder={q.placeholder || 'Enter your answer...'}
          />
        )}

        {q.type === 'long_text' && (
          <textarea
            value={(answers[q.id] as string) || ''}
            onChange={(e) => setAnswer(q.id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm min-h-[120px] resize-none"
            placeholder={q.placeholder || 'Enter your answer...'}
          />
        )}

        {q.type === 'number' && (
          <input
            type="number"
            value={(answers[q.id] as string) || ''}
            onChange={(e) => setAnswer(q.id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
            placeholder={q.placeholder || 'Enter a number...'}
            min="0"
          />
        )}

        {q.type === 'url' && (
          <input
            type="url"
            value={(answers[q.id] as string) || ''}
            onChange={(e) => setAnswer(q.id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
            placeholder={q.placeholder || 'https://...'}
          />
        )}

        {q.type === 'file_upload' && (
          <div className={`border-2 border-dashed border-gray-200 rounded-lg p-6 text-center transition-colors ${
            mode !== 'live' ? 'opacity-75 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-gray-300 cursor-pointer'
          }`}>
            <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              <span className="font-medium text-gray-700">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {mode !== 'live' ? 'Preview only' : 'PDF, DOCX, PNG, JPG up to 10MB'}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <motion.div
      className="bg-white min-h-screen flex flex-col"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { duration: 0.25, ease: "easeOut" } }}
      exit={{ x: '100%', opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
    >
      <div className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Apply for {job.title}</h2>
          <p className="text-sm text-gray-500">Please fill out the details below.</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 p-6 @2xl:p-10 bg-gray-50">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-10">
          <section className="bg-white p-6 @2xl:p-8 rounded-xl shadow-sm space-y-6">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">
              Documents
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume / CV <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 border-dashed border-gray-200 rounded-lg p-8 text-center transition-colors group ${
                mode !== 'live' ? 'opacity-75 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-gray-300 cursor-pointer'
              }`}>
                <UploadCloud className="mx-auto h-10 w-10 text-gray-400 group-hover:text-gray-600" />
                <p className="mt-2 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {mode !== 'live' ? 'Preview only' : 'PDF, DOCX up to 10MB'}
                </p>
              </div>
            </div>

            {(mode === 'preview' || job.requireCoverLetter) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter {job.requireCoverLetter && <span className="text-red-500">*</span>}
                </label>
                <div className={`border-2 border-dashed border-gray-200 rounded-lg p-8 text-center transition-colors group ${
                  mode !== 'live' ? 'opacity-75 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-gray-300 cursor-pointer'
                }`}>
                  <UploadCloud className="mx-auto h-10 w-10 text-gray-400 group-hover:text-gray-600" />
                  <p className="mt-2 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {mode !== 'live' ? 'Preview only' : 'PDF, DOCX up to 10MB'}
                  </p>
                </div>
              </div>
            )}

            {mode === 'preview' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
                />
              </div>
            )}
          </section>

          {questions.length > 0 && (
            <section className="bg-white p-6 @2xl:p-8 rounded-xl shadow-sm space-y-8">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">
                Screening Questions
              </h3>

              {questions.map((q, idx) => renderQuestion(q, idx))}
            </section>
          )}

          <div className="pt-2 pb-8">
            <button
              type="submit"
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold uppercase tracking-widest text-sm transition-all hover:scale-[1.01] active:scale-[0.99] rounded"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
