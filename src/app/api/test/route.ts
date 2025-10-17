import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing basic Prisma connection...')
    
    // Simple test query
    const businessCount = await prisma.business.count()
    console.log('Business count:', businessCount)
    
    return NextResponse.json({ 
      success: true, 
      businessCount,
      message: 'Basic Prisma connection works' 
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
