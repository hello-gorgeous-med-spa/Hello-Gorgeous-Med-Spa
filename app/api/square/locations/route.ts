// ============================================================
// SQUARE LOCATIONS API
// Get locations for connected merchant
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getLocationsApiAsync } from '@/lib/square/client';
import { getActiveConnection } from '@/lib/square/oauth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check for active connection
    const connection = await getActiveConnection();
    if (!connection) {
      return NextResponse.json(
        { error: 'Square not connected' },
        { status: 401 }
      );
    }
    
    const locationsApi = await getLocationsApiAsync();
    if (!locationsApi) {
      return NextResponse.json(
        { error: 'Square API not available' },
        { status: 500 }
      );
    }
    
    const { result } = await locationsApi.listLocations();
    
    const locations = (result.locations || []).map((loc: any) => ({
      id: loc.id,
      name: loc.name,
      address: loc.address ? {
        line1: loc.address.addressLine1,
        line2: loc.address.addressLine2,
        city: loc.address.locality,
        state: loc.address.administrativeDistrictLevel1,
        zip: loc.address.postalCode,
        country: loc.address.country,
      } : null,
      timezone: loc.timezone,
      status: loc.status,
      capabilities: loc.capabilities,
      phoneNumber: loc.phoneNumber,
      businessEmail: loc.businessEmail,
      createdAt: loc.createdAt,
    }));
    
    return NextResponse.json({
      locations,
      selectedLocationId: connection.location_id,
    });
    
  } catch (error) {
    console.error('Error fetching Square locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
