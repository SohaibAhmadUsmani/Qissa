import { testGemini, getStylistRecommendations } from "../services/aiStylistService.js";

export async function testAI(req, res) {
  try {
    const message = await testGemini();

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function stylistAI(req, res) {
  try {
    const { occasion, budget, preferredColor, style, season } = req.body;

    if (!occasion || budget === undefined || !style || !season) {
      return res.status(400).json({
        success: false,
        message: "Required fields: occasion, budget, style, season",
      });
    }

    const recommendations = await getStylistRecommendations({
      occasion,
      budget,
      preferredColor,
      style,
      season,
    });

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
