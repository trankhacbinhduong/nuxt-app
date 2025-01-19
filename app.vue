<template>
  <div class="learning-dashboard">
    <AppHeader />

    <main v-if="level" class="main-content">
      <h1 class="title">
        Chặng: {{ level.levelName }}
      </h1>

      <nav class="navbar">
        <button class="today-button" @click="scrollToTodaySession">
          Hôm nay
        </button>
        <h2 class="title">
          Tổng quan
        </h2>
      </nav>

      <MonthlySessionList
        class="monthly-sessions"
        :monthly-sessions="level.sessions"
      >
        <template #default="{ session }">
          <div :class="['session-card', `-${session.status.value}`]">
            <div class="header">
              <span :class="['badge', `-${session.status.value}`]">
                Buổi {{ session.overallIndex }}
                <img v-if="session.status.icon" :src="session.status.icon">
              </span>

              <span v-if="session.date" class="label -date">{{ formatDate(session.date) }}</span>

              <div class="value -score">
                <img src="~/assets/images/trophy.svg" alt="trophy">
                {{ session.proficiency }}/{{ session.totalProficiency }}
              </div>
            </div>

            <div class="session-units">
              <div
                v-for="unitId in session.unitIds"
                :key="unitId"
                class="session-unit"
              >
                <span :class="['title', `-${session.status.value}`] ">
                  <span :class="['status', `-${session.status.value}`]" />
                  {{ level.units[unitId] }}
                </span>
              </div>
            </div>

            <p v-if="session.status.label" :class="['status', `-${session.status.value}`]">
              {{ session.status.label }}
            </p>
          </div>
        </template>
      </MonthlySessionList>
    </main>

    <ProgressPanel
      class="progress-panel"
      v-bind="progressPanelProps"
    />
  </div>
</template>

<script lang="ts" setup>
import doneIcon from '~/assets/images/done.svg'
import todayIcon from '~/assets/images/today.svg'
import lateIcon from '~/assets/images/warn.svg'

const { level, progressPanelProps } = await useLevelData()

function scrollToTodaySession() {
  const todaySessionCard = document.querySelector('.session-card.-today')
  todaySessionCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

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

  const progressPanelProps = computed(() => {
    return {
      username: 'Trần Khắc Bình Dương',
      duration: level.value!.duration,
      remainingDuration: level.value!.remainingDuration,
      ...level.value!.missions,
    }
  })

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

  return { level, progressPanelProps }
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

  @include media-down(md) {
    height: 100%;
    grid-template-columns: 1fr;
    padding: 84px 32px 32px 32px;
  }

  @include media-down(sm) {
    padding: 84px 16px 16px 16px;
  }

  > .progress-panel {
    margin: var(--space-48) 0 auto 0;

    @include media-down(md) {
      margin-top: 0;
      grid-row: 1;
    }
  }
}

.main-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 84px);

  @include media-down(md) {
    height: auto;
  }

  > .title {
    margin-bottom: var(--space-16);
    @include font-style(text-xl-bold, var(--color-white));

    @include media-down(sm) {
      margin-bottom: var(--space);
      @include font-style(text-lg-bold, var(--color-white));
    }
  }

  > .navbar {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--space-12);
    padding: var(--space-16);
    background: var(--color-white);
    border-bottom: 1px solid var(--color-gray-2);
    border-top-left-radius: var(--space-16);
    border-top-right-radius: var(--space-16);

    @include media-down(md) {
      height: 60px;
      padding: var(--space-12);
      position: sticky;
      top: var(--space-64);
      z-index: 2;
      border-radius: 0px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    > .today-button {
      padding: var(--space-10) var(--space-16);
      border: 1px solid var(--color-gray-3);
      border-radius: var(--border-radius-md);
      background: var(--color-white);
      cursor: pointer;
      @include font-style(text-sm-semi, var(--color-text-1));

      @include media-down(sm) {
        padding: var(--space) var(--space-12);
        @include font-style(text-xs-semi, var(--color-text-1));
      }
    }

    > .title {
      @include font-style(text-lg-bold, var(--color-text-1));

      @include media-down(sm) {
        @include font-style(text-md-bold, var(--color-text-1));
      }
    }
  }

  > .monthly-sessions {
    flex:1;
    overflow-y: auto;

    @include media-down(md) {
      overflow-y: unset;
    }
  }
}

.session-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space);
  padding: var(--space-12);
  background: var(--color-gray-4);
  border-radius: var(--border-radius-lg);

  @include media-down(sm) {
    padding: var(--space);
  }

  &.-today {
    border: 2px solid var(--color-blue);
    background: #EBF5FF;
  }

  &.-completed {
    background: #F0FDF4;
  }

  &.-late {
    background: #FFFBEB;
  }

  > .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space);

    .label {
      @include font-style(text-sm-semi, var(--color-text-1));

      &.-date {
        flex: 1;
      }
    }

    .value {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      @include font-style(text-sm-regular, var(--color-text-2));
    }
  }

  > .status {
    @include font-style(text-xs-regular, var(--color-green));

    &.-completed {
      color: var(--color-green);
    }

    &.-late {
      color: var(--color-orange);
    }

    &.-today {
      color: var(--color-blue)
    }
  }
}

.session-units {
  flex: 1;
}

.session-unit {
  display: flex;
  align-items: center;
  padding: var(--space-4) var(--space);
  gap: var(--space-4);

  .status {
    display: inline-block;
    height: 8px;
    aspect-ratio: cos(30deg);
    clip-path: polygon(-50% 50%,50% 100%,150% 50%,50% 0);
    background: var(--color-blue);

    &.-completed {
      background: var(--color-green);
    }

    &.-late {
      background: var(--color-orange);
    }

    &.-today {
      background: var(--color-blue)
    }
  }

  .title {
    @include font-style(text-xs-regular);

    &:hover {
      text-decoration: underline;
      cursor: pointer;
      color: var(--color-blue)
    }

    &.-completed:hover {
      color: var(--color-green);
    }

    &.-late:hover {
      color: var(--color-orange);
    }
  }
}

.badge {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space);
  border-radius: var(--border-radius-md);
  @include font-style(text-sm-bold, var(--color-white));
  background: var(--color-gray-5);

  &.-completed {
    background: var(--color-green);
  }

  &.-late {
    background: var(--color-orange);
  }

  &.-today {
    background: var(--color-blue)
  }
}
</style>
