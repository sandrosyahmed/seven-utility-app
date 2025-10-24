import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import "./App.css";
import AdBanner from "./components/AdBanner";

/* ───────────── TO-DO LIST ───────────── */
function TodoUtility() {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || []);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (!input.trim()) return;
    const newTasks = [...tasks, { text: input, done: false }];
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    setInput("");
  };

  const toggleDone = (i) => {
    const newTasks = tasks.map((t, idx) => (idx === i ? { ...t, done: !t.done } : t));
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const deleteTask = (i) => {
    const newTasks = tasks.filter((_, idx) => idx !== i);
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  return (
    <div>
      <h2>📝 To-Do List</h2>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add a new task..." />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map((t, i) => (
          <li key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              onClick={() => toggleDone(i)}
              style={{
                textDecoration: t.done ? "line-through" : "none",
                cursor: "pointer",
                flex: 1,
              }}
            >
              {t.text}
            </span>
            <button onClick={() => deleteTask(i)} style={{ marginLeft: 8 }}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────── NOTES ───────────── */
function NotesUtility() {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes")) || []);
  const [text, setText] = useState("");
  const [color, setColor] = useState("#ffd54f");

  const addNote = () => {
    if (!text.trim()) return;
    const newNotes = [...notes, { text, color }];
    setNotes(newNotes);
    localStorage.setItem("notes", JSON.stringify(newNotes));
    setText("");
  };

  const deleteNote = (i) => {
    const newNotes = notes.filter((_, idx) => idx !== i);
    setNotes(newNotes);
    localStorage.setItem("notes", JSON.stringify(newNotes));
  };

  return (
    <div>
      <h2>🗒 Notes</h2>
      <textarea rows="4" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write something..." />
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 40, height: 40 }} />
        <button onClick={addNote}>Add Note</button>
      </div>
      <ul style={{ marginTop: 10 }}>
        {notes.map((n, i) => (
          <li key={i} style={{ background: n.color, borderRadius: 8, padding: 8, marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{n.text}</span>
              <button onClick={() => deleteNote(i)}>🗑</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────── CURRENCY CONVERTER ───────────── */
function CurrencyConverterUtility() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [result, setResult] = useState("");
  const [rates, setRates] = useState({});

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((res) => res.json())
      .then((data) => setRates(data.rates))
      .catch(() => alert("Failed to load exchange rates!"));
  }, []);

  const convert = () => {
    if (!amount || isNaN(amount)) {
      setResult("Invalid amount");
      return;
    }
    if (!rates[from] || !rates[to]) {
      setResult("Unavailable currency");
      return;
    }
    const usdValue = parseFloat(amount) / rates[from];
    const converted = usdValue * rates[to];
    setResult(converted.toFixed(2));
  };

  const currencyList = Object.keys(rates).slice(0, 25);

  return (
    <div>
      <h2>💱 Currency Converter</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          style={{ width: 120 }}
        />
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {currencyList.map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
        <span>→</span>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {currencyList.map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
      </div>
      <button onClick={convert}>Convert</button>
      <p style={{ marginTop: 10 }}>
        {result && (
          <>
            <strong>Result:</strong> {amount} {from} = {result} {to}
          </>
        )}
      </p>
    </div>
  );
}

/* ───────────── UNIT CONVERTER ───────────── */
function UnitConverterUtility() {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [result, setResult] = useState("");
  const conversions = { m: 1, cm: 100, ft: 3.28084, in: 39.3701 };

  const convert = () => {
    if (isNaN(parseFloat(value))) return setResult("Invalid");
    const meters = parseFloat(value) / conversions[fromUnit];
    const converted = meters * conversions[toUnit];
    setResult(converted.toFixed(4));
  };

  return (
    <div>
      <h2>📏 Unit Converter</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" />
        <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
          <option value="m">Meters</option>
          <option value="cm">Centimeters</option>
          <option value="ft">Feet</option>
          <option value="in">Inches</option>
        </select>
        <span>→</span>
        <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
          <option value="m">Meters</option>
          <option value="cm">Centimeters</option>
          <option value="ft">Feet</option>
          <option value="in">Inches</option>
        </select>
      </div>
      <button onClick={convert}>Convert</button>
      <p>Result: {result}</p>
    </div>
  );
}

/* ───────────── PNG → PDF ───────────── */
function PngToPdfUtility() {
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) return alert("Please select a valid image!");
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const convertToPdf = () => {
    if (!image) return alert("Upload an image first!");
    const pdf = new jsPDF();
    pdf.addImage(image, "PNG", 10, 10, 180, 160);
    pdf.save("converted.pdf");
  };

  return (
    <div>
      <h2>🖼 PNG → PDF Converter</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {image && (
        <>
          <img src={image} alt="preview" style={{ maxWidth: "100%", marginTop: 10 }} />
          <button onClick={convertToPdf} style={{ marginTop: 10 }}>Convert to PDF</button>
        </>
      )}
    </div>
  );
}

/* ───────────── PASSWORDS ───────────── */
function PasswordUtility() {
  const [passwords, setPasswords] = useState(() => JSON.parse(localStorage.getItem("passwords")) || []);
  const [name, setName] = useState("");
  const [length, setLength] = useState(12);
  const [generated, setGenerated] = useState("");

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < length; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    setGenerated(pass);
  };

  const savePassword = () => {
    if (!name || !generated) return alert("Enter a name and generate first!");
    const newList = [...passwords, { name, password: generated }];
    setPasswords(newList);
    localStorage.setItem("passwords", JSON.stringify(newList));
    setName(""); setGenerated("");
  };

  const deletePassword = (i) => {
    const newList = passwords.filter((_, idx) => idx !== i);
    setPasswords(newList);
    localStorage.setItem("passwords", JSON.stringify(newList));
  };

  const copyPassword = (p) => {
    navigator.clipboard.writeText(p);
    alert("✅ Copied to clipboard!");
  };

  return (
    <div>
      <h2>🔑 Password Manager</h2>
      <div style={{ marginBottom: 10 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Label (e.g. Gmail)" />
        <input
          type="number"
          value={length}
          min="4"
          max="32"
          onChange={(e) => setLength(e.target.value)}
          style={{ width: 70, marginLeft: 8 }}
        />
        <button onClick={generatePassword}>Generate</button>
      </div>
      {generated && (
        <div>
          <p><strong>Generated:</strong> {generated}</p>
          <button onClick={savePassword}>Save</button>
        </div>
      )}
      <ul style={{ marginTop: 15 }}>
        {passwords.map((p, i) => (
          <li key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
            <strong>{p.name}:</strong> {p.password}
            <button onClick={() => copyPassword(p.password)}>Copy</button>
            <button onClick={() => deletePassword(i)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────── QR CODE ───────────── */
function QrUtility() {
  const [text, setText] = useState("");
  const [qr, setQr] = useState("");

  const generateQR = async () => {
    if (!text.trim()) return;
    const url = await QRCode.toDataURL(text);
    setQr(url);
  };

  return (
    <div>
      <h2>🔳 QR Code Generator</h2>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text or URL" />
      <button onClick={generateQR}>Generate</button>
      {qr && <img src={qr} alt="QR" style={{ marginTop: 10 }} />}
    </div>
  );
}

/* ───────────── MAIN APP ───────────── */
export default function App() {
  const [view, setView] = useState("todo");
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("light", !dark);
  }, [dark]);

  return (
    <div className="app-container">
      <h1 className="app-header">7️⃣ Seven Utility App</h1>

      <AdBanner /> {/* Your ad component */}

      <div className="utility-nav">
        <button onClick={() => setView("todo")}>To-Do</button>
        <button onClick={() => setView("notes")}>Notes</button>
        <button onClick={() => setView("currency converter")}>Currency Converter</button>
        <button onClick={() => setView("converter")}>Converter</button>
        <button onClick={() => setView("pngpdf")}>PNG→PDF</button>
        <button onClick={() => setView("password")}>Passwords</button>
        <button onClick={() => setView("qr")}>QR Code</button>
        <button onClick={() => setDark(!dark)} className="theme-toggle">
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="utility-card">
        {view === "todo" && <TodoUtility />}
        {view === "notes" && <NotesUtility />}
        {view === "currency converter" && <CurrencyConverterUtility />}
        {view === "converter" && <UnitConverterUtility />}
        {view === "pngpdf" && <PngToPdfUtility />}
        {view === "password" && <PasswordUtility />}
        {view === "qr" && <QrUtility />}
      </div>

      <footer style={{ marginTop: 40, textAlign: "center", padding: 15, borderTop: "1px solid #444" }}>
        <p>Created by <strong>SandrosyAhmed</strong> • © 2025 Seven Utility App</p>
        <p>
          Built with ❤️ by{" "}
          <a href="https://yourcompanysite.com" target="_blank" rel="noopener noreferrer">
            7X Mobile Development Studio
          </a>
        </p>
      </footer>
    </div>
  );
}
