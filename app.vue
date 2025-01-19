<template>
  <div class="learning-dashboard">
    <AppHeader />
  </div>
</template>

<script lang="ts" setup>
import doneIcon from '~/assets/images/done.svg'
import todayIcon from '~/assets/images/today.svg'
import lateIcon from '~/assets/images/warn.svg'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { level } = await useLevelData()

async function useLevelData() {
  const { data: level, error } = await useFetch('/api/levels/1', {
    transform: (data: Level) => {
      const units = formatSessionUnits(data.units)
      const sessionsSorted = data.sessions.sort((a, b) => a.overallIndex - b.overallIndex)
      const sessions = preprocessSessionDataByMonth(sessionsSorted)

      return { ...data, units, sessions }
    },
  })

  if (error.value) {
    // TODO: Handle error
    console.error(error.value)
  }

  function preprocessSessionDataByMonth(sessions: Session[]) {
    const monthBoundaries = getMonthBoundaries(sessions)

    const groupedByMonth = sessions.reduce((acc, session) => {
      session.status = useSessionStatus(session.date, session.completionDate, session.completed)

      const monthKey = session.date ? session.date.substring(0, 7) : findMonthForIndex(session.overallIndex, monthBoundaries)
      if (!acc[monthKey]) {
        acc[monthKey] = []
      }

      acc[monthKey].push(session)
      return acc
    }, {} as Record<string, Session[]>)

    return groupedByMonth
  }

  function useSessionStatus(date: string | null, completionDate: string | null, completed: boolean) {
    const today = new Date()
    const sessionDate = date ? new Date(date) : null

    const sessionStatus = {
      completed: { value: 'completed', icon: doneIcon, label: `Đã hoàn thành: ${formatDate(completionDate!)}` },
      today: { value: 'today', icon: todayIcon, label: 'Đã hoàn thành buổi học hôm nay' },
      late: { value: 'late', icon: lateIcon, label: 'Bạn chưa hoàn thành buổi học này' },
      future: { value: 'future', icon: '', label: '' },
      preCreation: { value: 'completed', icon: doneIcon, label: 'Đã hoàn thành trước khi khởi tạo Study Plan' },
    }

    if (!sessionDate) return sessionStatus.preCreation
    if (completed) return sessionStatus.completed
    const isToday = sessionDate?.toDateString() === today.toDateString()
    if (isToday) return sessionStatus.today
    return sessionDate < today ? sessionStatus.late : sessionStatus.future
  }

  function getMonthBoundaries(sessions: Session[]) {
    return sessions.reduce((acc, session) => {
      if (session.date) {
        const monthKey = session.date.substring(0, 7)
        if (!acc[monthKey]) {
          acc[monthKey] = { firstIndex: session.overallIndex, lastIndex: session.overallIndex }
        }
        else {
          const bounds = acc[monthKey]
          bounds.firstIndex = Math.min(bounds.firstIndex, session.overallIndex)
          bounds.lastIndex = Math.max(bounds.lastIndex, session.overallIndex)
        }
      }
      return acc
    }, {} as Record<string, { firstIndex: number, lastIndex: number }>)
  }

  function findMonthForIndex(index: number, monthBoundaries: Record<string, { firstIndex: number, lastIndex: number }>) {
    const months = Object.keys(monthBoundaries).sort((a, b) => monthBoundaries[a].firstIndex - monthBoundaries[b].firstIndex)
    for (const month of months) {
      const bounds = monthBoundaries[month]
      if (index >= bounds.firstIndex && index <= bounds.lastIndex) {
        return month
      }
    }

    if (index > monthBoundaries[months[months.length - 1]].lastIndex) {
      return months[months.length - 1]
    }
    return months[0]
  }

  return { level }
}

function formatSessionUnits(units: SessionUnit[]) {
  return units.reduce((acc, unit) => {
    acc[unit.unitId] = unit.unitTitle
    return acc
  }, {} as Record<string, string>)
}
</script>

<style scoped lang="scss">
.learning-dashboard {
  display: grid;
  grid-template-columns: 1fr 300px;
  height: 100vh;
  gap: var(--space-16);
  background: linear-gradient(180deg, var(--color-background) 50.06%, #A9DAEC 100%);
  padding: 84px 64px 0px 64px;
  overflow: hidden;

  @include media-down(md) {
    grid-template-columns: 1fr;
    padding: 84px 32px 0px 32px;
  }

  @include media-down(sm) {
    padding: 84px 16px 0px 16px;
  }
}
</style>
