export const CROPS = ["Fruits", "Vegetables", "Protein", "Grains", "Vines", "Berries"];
export const initialCrops = () => Object.fromEntries(CROPS.map((c) => [c, false]));
