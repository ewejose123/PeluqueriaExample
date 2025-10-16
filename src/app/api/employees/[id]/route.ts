import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('id')

    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 })
    }

    // Check if employee has any appointments
    const appointments = await prisma.appointment.findMany({
      where: { employeeId }
    })

    if (appointments.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete employee with existing appointments' 
      }, { status: 400 })
    }

    await prisma.employee.delete({
      where: { id: employeeId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting employee:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
