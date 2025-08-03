import api from "../util/api.util";

export const getHotTrends = async () => {
  return await api.get(`trend/hot-topics`);
}
