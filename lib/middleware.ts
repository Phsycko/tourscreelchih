import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

export async function requireAuth(request: NextRequest) {
  const token = getAuthToken(request)

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const payload = verifyToken(token)
    return payload
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}

export async function requireRole(request: NextRequest, allowedRoles: string[]) {
  const authResult = await requireAuth(request)
  
  if (authResult instanceof NextResponse) {
    return authResult
  }

  if (!allowedRoles.includes(authResult.role)) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }

  return authResult
}

