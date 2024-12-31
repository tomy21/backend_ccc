// streaming controller
import ffmpeg from "fluent-ffmpeg";

const rtspUrl =
  "rtsp://ops:ops12345@103.84.233.81:8000/cam/realmonitor?channel=4&subtype=0";

// Menyimpan referensi proses ffmpeg
let ffmpegProcess = null;

export const streamCCTV = (req, res) => {
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
