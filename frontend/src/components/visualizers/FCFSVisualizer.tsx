import React, { useState } from "react";

interface Process {
  id: string;
  arrival: number;
  burst: number;
  color: string;
}

interface Timeline {
  id: string;
  start: number;
  end: number;
  burst: number;
  color: string;
}

const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFD93D",
  "#6C5CE7",
  "#00B894",
  "#FDCB6E",
  "#0984E3",
];

const FCFSVisualizer: React.FC = () => {
  const [arrival, setArrival] = useState("");
  const [burst, setBurst] = useState("");
  const [processes, setProcesses] = useState<Process[]>([]);
  const [timeline, setTimeline] = useState<Timeline[]>([]);
  const [results, setResults] = useState<any[]>([]);

  const addProcess = () => {
    if (!arrival || !burst) return;

    const newProcess: Process = {
      id: `P${processes.length + 1}`,
      arrival: parseInt(arrival),
      burst: parseInt(burst),
      color: colors[processes.length % colors.length],
    };

    setProcesses([...processes, newProcess]);
    setArrival("");
    setBurst("");
  };

  const runFCFS = () => {
    const sorted = [...processes].sort((a, b) => a.arrival - b.arrival);

    let time = 0;
    const gantt: Timeline[] = [];
    const metrics: any[] = [];

    sorted.forEach((p) => {
      if (time < p.arrival) time = p.arrival;

      const start = time;
      const end = time + p.burst;

      const waiting = start - p.arrival;
      const turnaround = end - p.arrival;

      gantt.push({
        id: p.id,
        start,
        end,
        burst: p.burst,
        color: p.color,
      });

      metrics.push({
        ...p,
        waiting,
        turnaround,
      });

      time = end;
    });

    setTimeline(gantt);
    setResults(metrics);
  };

  return (
    <div
      style={{
        marginTop: "30px",
        background: "#0F172A",
        padding: "25px",
        borderRadius: "10px",
        color: "white",
      }}
    >
      <h2 style={{ marginBottom: "15px", color: "#38BDF8" }}>
        FCFS Scheduling Visualizer
      </h2>

      {/* INPUT PANEL */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          placeholder="Arrival Time"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "none",
          }}
        />

        <input
          placeholder="Burst Time"
          value={burst}
          onChange={(e) => setBurst(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "none",
          }}
        />

        <button
          onClick={addProcess}
          style={{
            background: "#22C55E",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add
        </button>

        <button
          onClick={runFCFS}
          style={{
            background: "#3B82F6",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Run Simulation
        </button>
      </div>

      {/* PROCESS TABLE */}
      <table
        style={{
          width: "100%",
          marginBottom: "25px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#1E293B" }}>
            <th style={{ padding: "8px" }}>Process</th>
            <th>Arrival</th>
            <th>Burst</th>
          </tr>
        </thead>

        <tbody>
          {processes.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: "8px", color: p.color }}>{p.id}</td>
              <td>{p.arrival}</td>
              <td>{p.burst}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* GANTT CHART */}
      {timeline.length > 0 && (
        <>
          <h3 style={{ marginBottom: "10px", color: "#FBBF24" }}>
            Execution Timeline
          </h3>

          <div style={{ display: "flex", alignItems: "center" }}>
            {timeline.map((t, i) => (
              <div
                key={i}
                style={{
                  background: t.color,
                  padding: "12px",
                  minWidth: `${t.burst * 60}px`,
                  textAlign: "center",
                  borderRadius: "6px",
                  marginRight: "3px",
                  fontWeight: "bold",
                  animation: "fadeIn 0.6s ease",
                }}
              >
                {t.id}
              </div>
            ))}
          </div>

          <div style={{ display: "flex" }}>
            {timeline.map((t, i) => (
              <div
                key={i}
                style={{
                  minWidth: `${t.burst * 60}px`,
                  textAlign: "left",
                  fontSize: "12px",
                }}
              >
                {t.start}
              </div>
            ))}
            <div>{timeline[timeline.length - 1].end}</div>
          </div>
        </>
      )}

      {/* RESULTS */}
      {results.length > 0 && (
        <>
          <h3 style={{ marginTop: "30px", color: "#A78BFA" }}>
            Performance Metrics
          </h3>

          <table
            style={{
              width: "100%",
              marginTop: "10px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ background: "#1E293B" }}>
                <th>Process</th>
                <th>Waiting Time</th>
                <th>Turnaround Time</th>
              </tr>
            </thead>

            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td style={{ color: r.color }}>{r.id}</td>
                  <td>{r.waiting}</td>
                  <td>{r.turnaround}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default FCFSVisualizer;