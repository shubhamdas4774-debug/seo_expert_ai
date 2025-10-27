// server.js
import express from "express";
import path from "path";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname } from "path";
import OpenAI from "openai";

dotenv.config();

// ✅ Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;

// EJS setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Static folder (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// 🏠 Render index.ejs on home route
app.get("/", (req, res) => {
  res.render("index");
});

// 🧠 Chatbot route (connects front-end to API)
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("📩 Message received from frontend:", message);

    const a4f_api_key = process.env.A4F_API_KEY;
    const a4f_base_url = process.env.A4F_BASE_URL;
const a4fClient = new OpenAI({
  apiKey: a4f_api_key,
  baseURL: a4f_base_url,
});
const response = await a4fClient.chat.completions.create({
    model: "provider-6/llama-3.2-3b-instruct",
    messages: [
      { role: "system", content: "You are a helpful assistant for SEO, YouTube and social media content ideas." },
      { role: "user", content: message },
    ],
  });

    // console.log("🛰️ A4F API status:", response.status);

    console.log(response.choices[0].message.content);

    const reply = response?.choices?.[0]?.message?.content || "⚠ No response.";
    res.json({ reply });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ reply: "❌ Error connecting to ChatGPT API." });
  }
});


    // Replace with your a4f.co API credentials
//     const a4f_api_key = process.env.A4F_API_KEY;
//     const a4f_base_url = process.env.A4F_BASE_URL;

// const response = await a4fClient.chat.completions.create({
//     model: "provider-1/gpt-oss-20b",
//     messages: [
//       { role: "system", content: "You are a helpful assistant for SEO, YouTube and social media content ideas." },
//       { role: "user", content: prompt },
//     ],
//   });

//     const data = await response.json();
//     const reply = data?.choices?.[0]?.message?.content || "⚠ No response.";
//     res.json({ reply });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ reply: "❌ Error connecting to ChatGPT API." });
//   }
// });

// 🚀 Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
