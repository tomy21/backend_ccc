import { dbOCC } from "../config/dbConfig.js";
import { OccLogActivity } from "../model/OccLogActivity.js";

export const logUserActivity = async (
  id_users,
  activity,
  action,
  ip_address
) => {
  const transaction = await dbOCC.transaction();
  try {
    // Simpan log aktivitas ke database dalam transaksi
    await OccLogActivity.create(
      {
        id_users,
        activity,
        action,
        ip_address,
      },
      { transaction }
    );

    // Commit transaksi
    await transaction.commit();
    console.log("Log aktivitas berhasil disimpan");
  } catch (error) {
    // Rollback jika ada kesalahan
    await transaction.rollback();
    console.error("Gagal menyimpan log aktivitas:", error.message);
  }
};
