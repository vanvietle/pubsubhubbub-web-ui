import { useState } from "react";
import axios from "axios";
import "./PubSubPage.css";

const isValidYoutubeUrl = (input: string): boolean => {
  if (!input) return false;
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;
  return pattern.test(input.trim());
};

export default function PubSubPage(): JSX.Element {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const backendBase = "https://pubsubhubbub-d5rq.onrender.com";

  const handleSubscribe = async () => {
    if (!url) return setMessage("URL không được để trống");
    if (!isValidYoutubeUrl(url)) return setMessage("URL không hợp lệ.");
    setLoading(true);
    setMessage(null);
    setChannelId(null);

    try {
      const res = await axios.post(`${backendBase}/api/subscribe`, {
        channelUrl: url.trim(),
        retries: 3,
      });

      if (res.data?.channelId) {
        setChannelId(res.data.channelId);
        setMessage("Đăng ký PubSubHubbub thành công!");
      } else if (res.data?.error) {
        setMessage(res.data.error);
      } else {
        setMessage("Không tìm thấy channelId hoặc subscribe thất bại.");
      }
    } catch (e: any) {
      console.error(e);
      setMessage(e?.response?.data?.message || "Lỗi khi gọi API backend");
    } finally {
      setLoading(false);
    }
  };

  const handleGetChannelId = async () => {
    if (!url) return setMessage("URL không được để trống");
    if (!isValidYoutubeUrl(url)) return setMessage("URL không hợp lệ.");
    setLoading(true);
    setMessage(null);
    setChannelId(null);

    try {
      const res = await axios.post(`${backendBase}/api/v1/channel/extractId`, {
        channelUrl: url.trim()
      });

      const channelId = res.data?.data?.channelId;

      if (channelId) {
        setChannelId(channelId);
        setMessage("Lấy Channel ID thành công!");
      } else {
        setMessage("Không tìm thấy channelId.");
      }
    } catch (e: any) {
      console.error(e);
      setMessage(e?.response?.data?.message || "Lỗi khi gọi API backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscribe-container">
      <h1>YouTube PubSubHubbub Tool</h1>

      <div className="subscribe-card">
        <label>Nhập URL channel YouTube:</label>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/@example"
        />

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="subscribe-btn"
          >
            {loading ? "Đang xử lý..." : "Subscribe"}
          </button>
          <button
            onClick={handleGetChannelId}
            disabled={loading}
            className="get-channel-btn"
          >
            {loading ? "Đang xử lý..." : "Get Channel ID"}
          </button>
        </div>

        {message && <div className="message">{message}</div>}

        {channelId && (
          <div className="channel-id">
            <p>Channel ID:</p>
            <p>{channelId}</p>
          </div>
        )}
      </div>
    </div>
  );
}
