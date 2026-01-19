import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai';

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's profile data
    const userProfile = await base44.entities.User.filter({ email: user.email });
    const userData = userProfile[0] || {};

    // Fetch user's interests
    const interests = await base44.entities.Interest.filter({ user_email: user.email });

    // Fetch user's partnership intents
    const partnershipIntents = await base44.entities.PartnershipIntent.filter({ user_email: user.email });

    // Fetch all available opportunities
    const allOpportunities = await base44.entities.Opportunity.list();

    // Build user context
    const userContext = {
      name: user.full_name,
      email: user.email,
      bio: userData.bio || '',
      title: userData.title || '',
      location: userData.location || '',
      interests: interests.map(i => i.interest_name),
      pastPartnerships: partnershipIntents.map(p => ({
        opportunity: p.opportunity_name,
        status: p.current_status
      })),
      profession: userData.profession || '',
      skills: userData.skills || []
    };

    // Use AI to analyze and recommend opportunities
    const aiPrompt = `You are an expert partnership matchmaker. Analyze the user's profile and recommend the TOP 5 most relevant opportunities from the list provided.

USER PROFILE:
${JSON.stringify(userContext, null, 2)}

AVAILABLE OPPORTUNITIES:
${JSON.stringify(allOpportunities.map(o => ({
  id: o.id,
  title: o.title,
  description: o.description,
  category: o.category,
  investment_min: o.investment_min,
  investment_max: o.investment_max,
  related_interests: o.related_interests
})), null, 2)}

For each recommended opportunity, provide:
1. The opportunity ID
2. A match score (0-100)
3. A brief explanation (2-3 sentences) of WHY this is a good match for the user

Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {
      "opportunity_id": "string",
      "match_score": number,
      "match_reason": "string"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional partnership matchmaking AI. Always return valid JSON."
        },
        {
          role: "user",
          content: aiPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const aiResult = JSON.parse(response.choices[0].message.content);

    // Enrich recommendations with full opportunity data
    const enrichedRecommendations = aiResult.recommendations
      .map(rec => {
        const opportunity = allOpportunities.find(o => o.id === rec.opportunity_id);
        if (!opportunity) return null;
        
        return {
          ...opportunity,
          match_score: rec.match_score,
          match_reason: rec.match_reason,
          ai_recommended: true
        };
      })
      .filter(Boolean)
      .slice(0, 5);

    return Response.json({
      success: true,
      recommendations: enrichedRecommendations,
      total: enrichedRecommendations.length
    });

  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});