import api from './api';

export async function getStylistRecommendations(data) {
  const res = await api.post('/ai/stylist', {
    occasion: data.occasion,
    budget: Number(data.budget),
    preferredColor: data.preferredColor,
    style: data.style,
    season: data.season,
  });
  return res.data;
}
