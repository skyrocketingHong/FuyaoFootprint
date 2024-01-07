
import nations from '../config/nations';
import provinces from '../config/china.province';
import cities from '../config/china.cityies';

function getMapSourceName(areaName) {
  const nation = nations.find((item) => item.name === areaName);
  if (nation) {
    return { level: 1, sourceName: nation.map };
  }
  const province = provinces.find((item) => item.name === areaName);
  if (province) {
    return { level: 2, sourceName: province.map };
  }
  const city = cities.find((item) => item.name === areaName);
  if (city) {
    return { level: 3, sourceName: city.map };
  }
  return null;
}

export default getMapSourceName;
