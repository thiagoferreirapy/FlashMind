/**
 * SM-2 inspired spaced repetition algorithm.
 * answer: 'right' | 'unsure' | 'wrong'
 */
export function calculateNextReview(progress, answer) {
  let { difficulty_score = 1.0, streak = 0, review_after } = progress

  const now = new Date()
  let intervalDays

  if (answer === 'wrong') {
    streak = 0
    difficulty_score = Math.min(difficulty_score + 0.3, 3.0)
    intervalDays = 0.04 // ~1 hour
  } else if (answer === 'unsure') {
    streak = Math.max(0, streak - 1)
    difficulty_score = Math.min(difficulty_score + 0.1, 3.0)
    intervalDays = Math.max(0.5, streak * 0.5)
  } else {
    streak += 1
    difficulty_score = Math.max(0.3, difficulty_score - 0.1)
    if (streak === 1)      intervalDays = 1
    else if (streak === 2) intervalDays = 3
    else                   intervalDays = Math.round(intervalDays_prev(streak, difficulty_score))
  }

  const next = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000)

  return {
    streak,
    difficulty_score: Math.round(difficulty_score * 100) / 100,
    review_after: next.toISOString(),
    last_review_at: now.toISOString()
  }
}

function intervalDays_prev(streak, difficulty) {
  return Math.max(1, Math.round((streak - 1) * 2.5 * (1 / difficulty)))
}

export function isDue(review_after) {
  if (!review_after) return true
  return new Date(review_after) <= new Date()
}

export function getDueCount(cards, progresses) {
  const progressMap = {}
  progresses.forEach(p => progressMap[p.card_id] = p)
  return cards.filter(c => {
    const p = progressMap[c.id]
    return !p || isDue(p.review_after)
  }).length
}
