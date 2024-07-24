const formatActivity = (row) => ({
    id: row.id,
    type: row.type,
    name: row.name,
    frameworkType: row.frameworkType,
    company_id: row.company_id,
    target: {
        value: row.targetValue,
        unit: row.targetUnit
    },
    scheduledAttributes: {
        participants: {
            actualAmount: row.actualAmount,
            maxAmount: row.maxAmount
        },
        schedule: {
            date: row.scheduleDate,
            day: row.scheduleDay,
            hours: row.scheduleHours,
            repeat: row.repeatFrequency
        }
    }
});

module.exports = { formatActivity };
