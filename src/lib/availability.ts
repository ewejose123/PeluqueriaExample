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

export function formatTimeSlot(time: string): string {
  return format(parseISO(time), 'HH:mm')
}

export function isTimeSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  appointments: Array<{ startTime: Date; endTime: Date }>,
  timeBlocks: Array<{ startTime: Date; endTime: Date }>
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

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  serviceDuration: number,
  appointments: Array<{ startTime: Date; endTime: Date }>,
  timeBlocks: Array<{ startTime: Date; endTime: Date }>
): Date[] {
  const slots: Date[] = []
  const start = parseISO(`2024-01-01T${startTime}:00`)
  const end = parseISO(`2024-01-01T${endTime}:00`)
  
  let current = start
  
  while (addMinutes(current, serviceDuration).getTime() <= end.getTime()) {
    const slotEnd = addMinutes(current, serviceDuration)
    
    if (isTimeSlotAvailable(current, slotEnd, appointments, timeBlocks)) {
      slots.push(new Date(current))
    }
    
    current = addMinutes(current, 30) // 30-minute intervals
  }
  
  return slots
}
