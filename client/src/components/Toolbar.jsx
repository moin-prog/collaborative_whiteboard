import React from "react";

function Toolbar({ color, setColor, strokeWidth, setStrokeWidth, tool, setTool, onUndo }) {
  return (
    <div style={styles.toolbar}>
      {/* Pen Tool */}
      <button
        onClick={() => setTool("pen")}
        style={tool === "pen" ? styles.active : styles.button}
        title="Draw with pen"
      >
        ✏️ Pen
      </button>

      {/* Eraser Tool */}
      <button
        onClick={() => setTool("eraser")}
        style={tool === "eraser" ? styles.active : styles.button}
        title="Erase strokes"
      >
        🧽 Eraser
      </button>

      {/* Color Picker */}
      <select
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={{ ...styles.select, backgroundColor: color, color: "white" }}
        title="Select pen color"
      >
        <option value="black">🖤 Black</option>
        <option value="red">❤️ Red</option>
        <option value="blue">💙 Blue</option>
        <option value="green">💚 Green</option>
      </select>

      {/* Stroke Width */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          style={styles.slider}
          title="Adjust stroke width"
        />
        <span style={{ fontSize: "14px" }}>{strokeWidth}px</span>
      </div>

      {/* Undo Button */}
      <button onClick={onUndo} style={styles.button} title="Undo last stroke">
        ↩️ Undo
      </button>

      {/* Save Button */}
      <button
        onClick={() => {
          const canvas = document.querySelector("canvas");
          const link = document.createElement("a");
          link.download = "whiteboard.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
        }}
        style={styles.button}
        title="Save canvas as image"
      >
        💾 Save
      </button>
    </div>
  );
}

const styles = {
  toolbar: {
  background: "#f4f4f4",
  padding: "10px 15px",
  display: "flex",
  flexWrap: "wrap", 
  gap: "10px",
  borderBottom: "1px solid #ccc",
},

  button: {
    padding: "6px 12px",
    fontSize: "14px",
    cursor: "pointer",
  },
  active: {
    padding: "6px 12px",
    fontSize: "14px",
    background: "#d0e6ff",
    border: "2px solid #007bff",
    cursor: "pointer",
  },
  select: {
    padding: "5px",
    fontSize: "14px",
    minWidth: "100px",
  },
  slider: {
    width: "100px",
  },
};

export default Toolbar;
