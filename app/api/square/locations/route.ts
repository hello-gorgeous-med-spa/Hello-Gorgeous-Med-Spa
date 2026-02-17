// ============================================================
// SQUARE LOCATIONS API
// Get locations for connected merchant
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getLocationsApiAsync } from '@/lib/square/client';
import { getActiveConnection } from '@/lib/square/oauth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Check for active connection
    const connection = await getActiveConnection();
    console.log('[Square Locations] Connection:', connection ? 'Found' : 'Not found');
    
    if (!connection) {
      return NextResponse.json(
        { error: 'Square not connected' },
        { status: 401 }
      );
    }
    
    // Try to fetch locations from Square API
    let locations: any[] = [];
    
    try {
      const locationsApi = await getLocationsApiAsync();
      console.log('[Square Locations] API:', locationsApi ? 'Initialized' : 'Failed');
      
      if (locationsApi) {
        console.log('[Square Locations] Calling listLocations...');
        const { result } = await locationsApi.listLocations();
        console.log('[Square Locations] Got', result.locations?.length || 0, 'locations');
        
        locations = (result.locations || []).map((loc: any) => ({
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
      }
    } catch (apiError) {
      console.error('[Square Locations] API error:', apiError);
    }
    
    // If API returned no locations but we have a synced location, include it
    if (locations.length === 0 && connection.location_id) {
      console.log('[Square Locations] Using synced location from connection');
      locations = [{
        id: connection.location_id,
        name: connection.location_name || 'Synced Location',
        address: null,
        status: 'ACTIVE',
      }];
    }
    
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
