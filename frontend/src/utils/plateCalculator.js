export const calculatePlates = (totalWeight, barWeight = 20, availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25]) => {
    if (totalWeight <= barWeight) {
        return []
    }

    let weightPerSide = (totalWeight - barWeight) / 2
    const plates = []

    availablePlates.sort((a, b) => b - a).forEach(plate => {
        while (weightPerSide >= plate) {
            plates.push(plate)
            weightPerSide -= plate
            weightPerSide = Math.round(weightPerSide * 100) / 100 // Avoid floating point issues
        }
    })

    return plates
}

export const formatPlateDisplay = (plates) => {
    if (plates.length === 0) {
        return 'Just the bar'
    }

    const plateCounts = {}
    plates.forEach(plate => {
        plateCounts[plate] = (plateCounts[plate] || 0) + 1
    })

    return Object.entries(plateCounts)
        .map(([plate, count]) => `${count}x${plate}kg`)
        .join(' + ')
}