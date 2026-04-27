function calculatePriorityScore(task, regionTaskCount) {
  const urgencyScore = task.urgency / 5
  const hoursToDeadline = (new Date(task.deadline) - Date.now()) / 3600000
  const deadlineScore = Math.max(0, 1 - hoursToDeadline / 168)
  const fillRate = task.slotsFilled / task.slotsNeeded
  const volunteerGapScore = 1 - fillRate
  const MAX_DENSITY = 20
  const regionDensityScore = Math.min(regionTaskCount / MAX_DENSITY, 1)

  return {
    priorityScore: (
      urgencyScore * 0.40 +
      deadlineScore * 0.30 +
      volunteerGapScore * 0.20 +
      regionDensityScore * 0.10
    ),
    breakdown: { urgencyScore, deadlineScore, volunteerGapScore, regionDensityScore }
  }
}

module.exports = { calculatePriorityScore }
