import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { expenses, budgetLimit } = await req.json();

    // If API key is provided, use 0G Compute via OpenAI compatible Router
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'app-sk-00000') {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL || 'https://0g.ai/api/v1',
      });

      const prompt = `
        Analyze the following spending habits and provide 3 short, actionable budget optimization tips.
        Budget Limit: $${budgetLimit}
        Recent Expenses: ${JSON.stringify(expenses)}
        
        Keep the response concise and formatted as a JSON array of strings.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Replace with specific 0G hosted model name if known
        messages: [{ role: "user", content: prompt }],
      });

      const tipsString = response.choices[0].message.content || '[]';
      let tips = [];
      try {
        tips = JSON.parse(tipsString);
      } catch (e) {
        // Fallback if not valid JSON
        tips = [tipsString];
      }

      return NextResponse.json({ success: true, tips });
    }

    // Simulation/Fallback when no keys are provided
    console.warn("No valid Compute API Key found. Simulating AI analysis.");
    
    // Simple heuristic-based simulation
    const totalSpent = expenses.reduce((sum: number, exp: any) => sum + Number(exp.amount), 0);
    const tips = [];
    
    if (totalSpent > budgetLimit * 0.8) {
      tips.push("You are approaching your budget limit. Consider pausing non-essential purchases.");
    }
    if (expenses.some((e: any) => e.category.toLowerCase() === 'food' && Number(e.amount) > 100)) {
      tips.push("High dining expenses detected. Meal prepping could save you a significant amount.");
    }
    if (tips.length === 0) {
      tips.push("Your spending is well-balanced. Keep up the good work!");
      tips.push("Consider investing any leftover budget into a high-yield savings account.");
    }

    tips.push("Track recurring subscriptions to ensure you aren't paying for unused services.");

    return NextResponse.json({ success: true, tips: tips.slice(0, 3) });
    
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to analyze spending" },
      { status: 500 }
    );
  }
}
