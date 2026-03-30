import { useState } from "react";

export default function App() {
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState("تعليمي");
  const [result, setResult] = useState("");
  const [lang, setLang] = useState("ar");

  const toggleLang = () => {
    setLang(lang === "ar" ? "en" : "ar");
  };

  const generate = async () => {
    setResult(lang === "ar" ? "جاري التحميل..." : "Loading...");

    const prompt =
      lang === "ar"
        ? `اكتب أفكار وهُوكات وسكريبتات فيديو في مجال ${niche} بأسلوب ${tone}`
        : `Create viral hooks and scripts about ${niche} in a ${tone} tone`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_API_KEY_HERE",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    setResult(data.choices[0].message.content);
  };

  return (
    <div style={{ padding: 20, background: "#0d0f14", minHeight: "100vh", color: "white" }}>

      <button onClick={toggleLang}>
        🌐 {lang === "ar" ? "EN" : "AR"}
      </button>

      <h2>
        {lang === "ar" ? "مولد الأفكار الفيرال" : "Viral Hook Generator"}
      </h2>

      <input
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
        placeholder={lang === "ar" ? "اكتب المجال" : "Enter niche"}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      >
        {lang === "ar" ? (
          <>
            <option>تعليمي</option>
            <option>جدلي</option>
            <option>قصصي</option>
            <option>كوميدي</option>
            <option>تحفيزي</option>
          </>
        ) : (
          <>
            <option>Educational</option>
            <option>Controversial</option>
            <option>Storytelling</option>
            <option>Humorous</option>
            <option>Inspirational</option>
          </>
        )}
      </select>

      <button onClick={generate} style={{ marginTop: 10 }}>
        {lang === "ar" ? "إنشاء" : "Generate"}
      </button>

      <div style={{ marginTop: 20, whiteSpace: "pre-line" }}>
        {result}
      </div>

    </div>
  );
}
