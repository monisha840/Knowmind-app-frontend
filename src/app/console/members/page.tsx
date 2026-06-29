'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Member {
  id: string
  name: string
  business?: string
  gender?: string
  marital_status?: string
  created_at: string
}

interface MemberWithSubmission extends Member {
  submission?: {
    overall: number
    domain_scores: Record<string, number>
  }
}

export default function MembersPage() {
  const [members, setMembers] = useState<MemberWithSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cohortStats, setCohortStats] = useState<any>(null)

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await fetch('/api/members')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load members')
        }

        setMembers(data.members)
        setCohortStats(data.cohortStats)
      } catch (err: any) {
        console.error('Load members error:', err)
        setError(err.message || 'Failed to load members')
      } finally {
        setLoading(false)
      }
    }

    loadMembers()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-text-muted">Loading members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-3 font-fraunces">
              Members
            </h1>
            <p className="text-lg text-text-muted">
              {members.length} member{members.length !== 1 ? 's' : ''} in database
            </p>
          </div>
          <Link
            href="/console/import"
            className="px-6 py-3 bg-primary text-primary-fg font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            Import Members
          </Link>
        </div>

        {error && (
          <div className="bg-error/10 border border-error rounded-lg p-6 mb-8">
            <p className="text-error">{error}</p>
          </div>
        )}

        {cohortStats && (
          <div className="bg-surface rounded-lg shadow-lg p-8 border border-border mb-8">
            <h2 className="text-2xl font-bold text-primary mb-6 font-fraunces">Cohort Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-text-muted mb-2">Cohort Average</p>
                <p className="text-3xl font-bold text-primary">
                  {cohortStats.average?.toFixed(2) || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-2">Weakest Domain</p>
                <p className="text-xl font-semibold text-amber-600">
                  {cohortStats.weakestDomain || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-2">Total Members</p>
                <p className="text-3xl font-bold text-secondary">{members.length}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-surface rounded-lg shadow-lg border border-border overflow-hidden">
          {members.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-text-muted mb-4">No members yet</p>
              <Link
                href="/console/import"
                className="inline-block px-6 py-3 bg-primary text-primary-fg font-medium rounded-lg hover:bg-primary-hover transition-colors"
              >
                Import Members
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-primary/5 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-primary">Name</th>
                    <th className="px-6 py-4 text-left font-semibold text-primary">Business</th>
                    <th className="px-6 py-4 text-left font-semibold text-primary">Gender</th>
                    <th className="px-6 py-4 text-center font-semibold text-primary">
                      Overall Score
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-primary">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, idx) => (
                    <tr
                      key={member.id}
                      className={
                        idx % 2 === 0
                          ? 'bg-white'
                          : 'bg-gray-50'
                      }
                    >
                      <td className="px-6 py-4 font-medium text-text">{member.name}</td>
                      <td className="px-6 py-4 text-text-muted">{member.business || '—'}</td>
                      <td className="px-6 py-4 text-text-muted">{member.gender || '—'}</td>
                      <td className="px-6 py-4 text-center">
                        {member.submission ? (
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-semibold rounded">
                            {member.submission.overall.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-text-muted text-xs">
                        {new Date(member.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
