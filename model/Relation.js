import { Description } from "./Description.js";
import { CategoryModel } from "./CategoryModel.js";
import Gate from "./Gate.js";

export const initRelations = () => {
  // Definisikan relasi setelah kedua model diimpor
  Description.belongsTo(CategoryModel, {
    foreignKey: "id_category",
    as: "category",
  });

  CategoryModel.hasMany(Description, {
    foreignKey: "id_category",
    as: "relatedObjects", // Gunakan alias berbeda jika diperlukan
  });
};
