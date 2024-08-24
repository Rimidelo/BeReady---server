export const formatActivity = (row) => ({
  id: row.ActivityID,
  type: row.Type,
  name: row.Name,
  description: row.Description,
  frameworkType: row.FrameworkType,
  instituteID: row.InstituteID,
  target: {
    value: row.TargetValue,
    unit: row.TargetUnit,
  },
  scheduledAttributes: {
    participants: {
      actualAmount: row.ParticipantsActual,
      maxAmount: row.ParticipantsMax,
    },
    schedule: {
      date: row.ScheduleDate,
      day: row.ScheduleDay,
      hours: `${row.StartTime} - ${row.EndTime}`,
      repeat: row.RepeatFrequency,
      startTime: row.StartTime,
      endTime: row.EndTime,
    },
  },
});