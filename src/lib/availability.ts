import { addMinutes, format, isAfter, isBefore, parseISO } from 'date-fns'

export interface TimeSlot {
  time: string
  employeeId: string
  employeeName: string
}

export interface AvailabilityParams {
  serviceId: string
  date: string
  businessId: string
}

export interface Appointment {
  startTime: Date
  endTime: Date
}

export interface TimeBlock {
  startTime: Date
  endTime: Date
}

export function formatTimeSlot(time: string): string {
  return format(parseISO(time), 'HH:mm')
}

export function isTimeSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  appointments: Appointment[],
  timeBlocks: TimeBlock[]
): boolean {
  // Check for appointment conflicts
  for (const appointment of appointments) {
    if (
      (isAfter(slotStart, appointment.startTime) && isBefore(slotStart, appointment.endTime)) ||
      (isAfter(slotEnd, appointment.startTime) && isBefore(slotEnd, appointment.endTime)) ||
      (isBefore(slotStart, appointment.startTime) && isAfter(slotEnd, appointment.endTime))
    ) {
      return false
    }
  }

  // Check for time block conflicts
  for (const block of timeBlocks) {
    if (
      (isAfter(slotStart, block.startTime) && isBefore(slotStart, block.endTime)) ||
      (isAfter(slotEnd, block.startTime) && isBefore(slotEnd, block.endTime)) ||
      (isBefore(slotStart, block.startTime) && isAfter(slotEnd, block.endTime))
    ) {
      return false
    }
  }

  return true
}

/**
 * Generate dynamic time slots based on actual appointment durations
 * Instead of fixed 30-minute intervals, this creates slots based on:
 * 1. Actual appointment end times
 * 2. Configurable interval (default 30 minutes)
 * 3. Working hours boundaries
 */
export function generateDynamicTimeSlots(
  startTime: string,
  endTime: string,
  serviceDuration: number,
  appointments: Appointment[],
  timeBlocks: TimeBlock[],
  selectedDate: Date,
  intervalMinutes: number = 30
): Date[] {
  const slots: Date[] = []
  
  // Create proper date objects using the selected date
  const start = new Date(selectedDate)
  const [startHour, startMinute] = startTime.split(':').map(Number)
  start.setHours(startHour, startMinute, 0, 0)
  
  const end = new Date(selectedDate)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  end.setHours(endHour, endMinute, 0, 0)
  
  // Create a timeline of all busy periods (appointments + time blocks)
  const busyPeriods: Array<{ start: Date; end: Date }> = [
    ...appointments.map(apt => ({ start: apt.startTime, end: apt.endTime })),
    ...timeBlocks.map(block => ({ start: block.startTime, end: block.endTime }))
  ]
  
  // Sort busy periods by start time
  busyPeriods.sort((a, b) => a.start.getTime() - b.start.getTime())
  
  // Generate available slots
  let current = new Date(start)
  
  while (addMinutes(current, serviceDuration).getTime() <= end.getTime()) {
    const slotEnd = addMinutes(current, serviceDuration)
    
    // Check if this slot conflicts with any busy period
    let isAvailable = true
    for (const period of busyPeriods) {
      if (
        (isAfter(current, period.start) && isBefore(current, period.end)) ||
        (isAfter(slotEnd, period.start) && isBefore(slotEnd, period.end)) ||
        (isBefore(current, period.start) && isAfter(slotEnd, period.end))
      ) {
        isAvailable = false
        break
      }
    }
    
    if (isAvailable) {
      slots.push(new Date(current))
    }
    
    // Move to next potential slot
    // If there's a busy period starting soon, jump to its end
    const nextBusyPeriod = busyPeriods.find(period => 
      isAfter(period.start, current) && 
      addMinutes(period.end, intervalMinutes).getTime() <= end.getTime()
    )
    
    if (nextBusyPeriod) {
      // Jump to the end of the busy period + interval
      current = addMinutes(nextBusyPeriod.end, intervalMinutes)
    } else {
      // Move by the standard interval
      current = addMinutes(current, intervalMinutes)
    }
  }
  
  return slots
}

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use generateDynamicTimeSlots instead
 */
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  serviceDuration: number,
  appointments: Appointment[],
  timeBlocks: TimeBlock[],
  selectedDate: Date
): Date[] {
  return generateDynamicTimeSlots(startTime, endTime, serviceDuration, appointments, timeBlocks, selectedDate, 30)
}
