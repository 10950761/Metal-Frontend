import React from "react";
import "./index.css";

const items = [
  { name: "Hammer", className: "hammer", description: "Used for driving nails." },
  { name: "Grinding Stone", className: "grinding-stone", description: "Used for grinding surfaces." },
  { name: "Wrench", className: "wrench", description: "Used to grip and turn objects." },
  { name: "Pipe", className: "pipe", description: "Used for transporting fluids." },
  { name: "Electrode", className: "electrode", description: "Used in welding." },
  { name: "Drill Bit", className: "drill-bit", description: "Used for making holes." },
  { name: "Sheet Metal", className: "sheet-metal", description: "Used in construction." },
  { name: "Bolt", className: "bolt", description: "Fastening material." },
  { name: "Chain", className: "chain", description: "Used for lifting or pulling." },
  { name: "Bucket", className: "bucket", description: "Used to carry materials." },
];

function Explore() {
  return (
    <div className="explore-container">
      <header className="header">
        <h1>Metal Tools & Materials</h1>
      </header>
      <main className="container">
        <section className="category">
          <h2>Available Items</h2>
          <div className="items-grid">
            {items.map((item, index) => (
              <div className="item" key={index}>
                <div className={`item-visual ${item.className}`}></div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Explore;
