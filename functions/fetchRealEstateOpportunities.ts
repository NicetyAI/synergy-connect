import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = Deno.env.get('RAPID_REAL_ESTATE_API');
    if (!apiKey) {
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Major Canadian cities coordinates to try
    const locations = [
      { name: 'Toronto', lat: 43.65, lon: -79.38 },
      { name: 'Vancouver', lat: 49.28, lon: -123.12 },
      { name: 'Calgary', lat: 51.05, lon: -114.07 },
    ];

    // Try first location (Toronto)
    const location = locations[0];
    const response = await fetch(
      `https://realty-in-ca1.p.rapidapi.com/properties/list?LatitudeMax=${location.lat + 0.5}&LatitudeMin=${location.lat - 0.5}&LongitudeMax=${location.lon + 0.5}&LongitudeMin=${location.lon - 0.5}&CurrentPage=1&RecordsPerPage=20&SortOrder=A&SortBy=1&CultureId=1&ApplicationId=1`,
      {
        headers: {
          'x-rapidapi-host': 'realty-in-ca1.p.rapidapi.com',
          'x-rapidapi-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { error: 'Failed to fetch real estate data', status: response.status, details: errorText },
        { status: response.status }
      );
    }

    const text = await response.text();
    if (!text) {
      return Response.json({ error: 'Empty response from API' }, { status: 500 });
    }

    const data = JSON.parse(text);

    // Transform the data into opportunity format
    const opportunities = [];
    
    if (data && data.Results) {
      data.Results.slice(0, 20).forEach((property) => {
        const price = property.Property?.Price;
        const partners = Math.floor(Math.random() * 20) + 1;
        
        opportunities.push({
          id: property.Id || `re-${Date.now()}-${Math.random()}`,
          type: 'Real Estate',
          title: `Single Family - ${property.Property?.Address?.City || 'Canada'} (MLS# ${property.MlsNumber || 'N/A'})`,
          investment: price 
            ? `$${price.toLocaleString()} - $${price.toLocaleString()}` 
            : 'Contact for pricing',
          description: `${property.Property?.Building?.BathroomTotal || '1'} bathroom, ${property.Property?.Building?.Type || 'Single Family'}, at ${property.Property?.Address?.AddressText || 'N/A'}|${property.Property?.Address?.City || 'N/A'}, ${property.Property?.Address?.Province || 'Canada'} ${property.Property?.Address?.Zip || ''}, wit...`,
          image: property.Property?.Photo?.[0]?.HighResPath || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
          postedDate: new Date(property.InsertedDateUTC || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          partners: `1/${partners} partners`,
        });
      });
    }

    return Response.json({ 
      success: true, 
      opportunities,
      count: opportunities.length 
    });

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});