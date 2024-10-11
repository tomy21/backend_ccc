import { Object } from "./Object.js";
import { CategoryModel } from "./CategoryModel.js";
import { IssuesModel } from "./Issues.js";
import Gate from "./Gate.js";

export const initRelations = () => {
  // Definisikan relasi setelah kedua model diimpor
  Object.belongsTo(CategoryModel, {
    foreignKey: "id_category",
    as: "category",
  });

  CategoryModel.hasMany(Object, {
    foreignKey: "id_category",
    as: "relatedObjects", // Gunakan alias berbeda jika diperlukan
  });

  // Relasi dengan tabel Gate (jika ada)
  IssuesModel.belongsTo(Gate, {
    foreignKey: "id_gate",
    targetKey: "id",
  });
};
