import { makeHikvisionRequest } from "../config/HikvisioConfig.js";
import { spawn } from "child_process";
import ffmpeg from "fluent-ffmpeg";

// Controller untuk menangkap gambar (capture)
export const captureImage = async (req, res) => {
  const channelId = req.query.channelId || 101;
  const idChannel = parseInt(channelId);
  const captureUrl = `/ISAPI/Streaming/channels/${idChannel}/picture`; // Endpoint capture untuk channel 101

  const hasil = await makeHikvisionRequest(
    captureUrl,
    "GET",
    null,
    "arraybuffer"
  );

  if (hasil) {
    res.setHeader("Content-Type", "image/jpeg"); // Pastikan mengirim tipe gambar
    res.send(Buffer.from(hasil, "binary")); // Mengirim data sebagai binary
  } else {
    res.status(500).send("Gagal menangkap gambar");
  }
};

// Controller untuk memulai streaming video
export const streamVideo = async (req, res) => {
  let ffmpegProcess = null;
  const rtspUrl =
    "rtsp://ops:ops12345@ccshlv.ddns.net:37770/cam/realmonitor?channel=1&subtype=0";

  // Set content type ke HLS
  res.contentType("application/vnd.apple.mpegurl");

  try {
    // Jika sudah ada streaming yang aktif, hentikan proses sebelumnya
    if (ffmpegProcess) {
      ffmpegProcess.kill("SIGINT"); // Menghentikan ffmpeg
    }

    // Mulai streaming RTSP ke HLS
    ffmpegProcess = ffmpeg(rtspUrl)
      .addOptions([
        "-preset fast",
        "-f hls", // Format HLS
        "-hls_time 2", // Durasi per segmen
        "-hls_list_size 0", // Daftar segmen tidak terbatas
        "-hls_flags delete_segments", // Menghapus segmen setelah selesai
        "-start_number 1", // Mulai dengan segmen ke-1
      ])
      .output(res, { end: true }) // Output stream langsung ke response
      .on("start", (commandLine) => {
        console.log("FFmpeg command line:", commandLine); // Debugging perintah
      })
      .on("error", (err, stdout, stderr) => {
        console.error("FFmpeg error:", err.message);
        console.error("FFmpeg stderr:", stderr);
        res.status(500).send(`Error streaming CCTV: ${err.message}`);
      })
      .on("end", () => {
        console.log("Streaming selesai");
      })
      .run();
  } catch (error) {
    console.error("Streaming error:", error);
    res.status(500).send("Error starting stream.");
  }
};
