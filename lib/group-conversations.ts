import { Conversation } from './types'

interface ConversationGroup {
  label: string
  items: Conversation[]
}

/**
 * Groups conversations by date relative to today:
 * - Today: updatedAt is within the current calendar day
 * - Yesterday: updatedAt is within the previous calendar day
 * - Previous 7 Days: updatedAt is within 2-7 days ago
 * - Older: everything else
 *
 * Each group is sorted by updatedAt descending.
 * Empty groups are excluded from the result.
 */
export function groupConversationsByDate(
  conversations: Conversation[]
): ConversationGroup[] {
  const now = new Date()

  // Start of today (midnight)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Start of yesterday
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)

  // Start of 7 days ago
  const startOf7DaysAgo = new Date(startOfToday)
  startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 7)

  const today: Conversation[] = []
  const yesterday: Conversation[] = []
  const previous7Days: Conversation[] = []
  const older: Conversation[] = []

  for (const conversation of conversations) {
    const updatedAt = conversation.updatedAt

    if (updatedAt >= startOfToday) {
      today.push(conversation)
    } else if (updatedAt >= startOfYesterday) {
      yesterday.push(conversation)
    } else if (updatedAt >= startOf7DaysAgo) {
      previous7Days.push(conversation)
    } else {
      older.push(conversation)
    }
  }

  // Sort each group by updatedAt descending
  const sortDesc = (a: Conversation, b: Conversation) =>
    b.updatedAt.getTime() - a.updatedAt.getTime()

  today.sort(sortDesc)
  yesterday.sort(sortDesc)
  previous7Days.sort(sortDesc)
  older.sort(sortDesc)

  // Build result, excluding empty groups
  const groups: ConversationGroup[] = []

  if (today.length > 0) {
    groups.push({ label: 'Today', items: today })
  }
  if (yesterday.length > 0) {
    groups.push({ label: 'Yesterday', items: yesterday })
  }
  if (previous7Days.length > 0) {
    groups.push({ label: 'Previous 7 Days', items: previous7Days })
  }
  if (older.length > 0) {
    groups.push({ label: 'Older', items: older })
  }

  return groups
}
