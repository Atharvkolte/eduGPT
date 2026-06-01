import React, { useState } from "react";
import "./RoundRobinVisualizer.css";

interface Process {
  id: string;
  arrival: number;
  burst: number;
  remaining: number;
  color: string;
}

interface Timeline {
  id: string;
  start: number;
  end: number;
  color: string;
}

const colors = [
  "#ff6b6b",
  "#4ecdc4",
  "#ffd93d",
  "#6c5ce7",
  "#00b894",
  "#fdcb6e",
  "#0984e3",
];

const RoundRobinVisualizer: React.FC = () => {
  const [arrival, setArrival] = useState("");
  const [burst, setBurst] = useState("");
  const [quantum, setQuantum] = useState("2");

  const [processes, setProcesses] = useState<Process[]>([]);
  const [timeline, setTimeline] = useState<Timeline[]>([]);
  const [results, setResults] = useState<any[]>([]);

  const addProcess = () => {
    if (!arrival || !burst) return;

    const newProcess: Process = {
      id: `P${processes.length + 1}`,
      arrival: parseInt(arrival),
      burst: parseInt(burst),
      remaining: parseInt(burst),
      color: colors[processes.length % colors.length],
    };

    setProcesses([...processes, newProcess]);
    setArrival("");
    setBurst("");
  };

  const runRoundRobin = () => {
    const q = parseInt(quantum);

    const queue: Process[] = [];
    const gantt: Timeline[] = [];
    const proc = processes.map((p) => ({ ...p }));

    let time = 0;
    let completed: any[] = [];

    proc.sort((a, b) => a.arrival - b.arrival);

    queue.push(proc[0]);
    let index = 1;

    while (queue.length > 0) {
      const current = queue.shift()!;

      const start = time;
      const execute = Math.min(current.remaining, q);
      time += execute;
      current.remaining -= execute;

      gantt.push({
        id: current.id,
        start,
        end: time,
        color: current.color,
      });

      while (index < proc.length && proc[index].arrival <= time) {
        queue.push(proc[index]);
        index++;
      }

      if (current.remaining > 0) {
        queue.push(current);
      } else {
        const turnaround = time - current.arrival;
        const waiting = turnaround - current.burst;

        completed.push({
          id: current.id,
          waiting,
          turnaround,
          color: current.color,
        });
      }
    }

    setTimeline(gantt);
    setResults(completed);
  };

  return (
    <div className="rr-container">

      <h2 className="rr-title">Round Robin Scheduling Visualizer</h2>

      <div className="rr-input-panel">
        <input
          placeholder="Arrival Time"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
        />

        <input
          placeholder="Burst Time"
          value={burst}
          onChange={(e) => setBurst(e.target.value)}
        />

        <input
          placeholder="Time Quantum"
          value={quantum}
          onChange={(e) => setQuantum(e.target.value)}
        />

        <button className="rr-add" onClick={addProcess}>
          Add
        </button>

        <button className="rr-run" onClick={runRoundRobin}>
          Run Simulation
        </button>
      </div>

      {/* Process Table */}
      <table className="rr-table">
        <thead>
          <tr>
            <th>Process</th>
            <th>Arrival</th>
            <th>Burst</th>
          </tr>
        </thead>

        <tbody>
          {processes.map((p) => (
            <tr key={p.id}>
              <td style={{ color: p.color }}>{p.id}</td>
              <td>{p.arrival}</td>
              <td>{p.burst}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Gantt Chart */}
      {timeline.length > 0 && (
        <>
          <h3 className="rr-subtitle">Execution Timeline</h3>

          <div className="rr-gantt">
            {timeline.map((t, i) => (
              <div
                key={i}
                className="rr-block"
                style={{
                  background: t.color,
                  minWidth: `${(t.end - t.start) * 60}px`,
                }}
              >
                {t.id}
              </div>
            ))}
          </div>

          <div className="rr-time">
            {timeline.map((t, i) => (
              <span
                key={i}
                style={{ minWidth: `${(t.end - t.start) * 60}px` }}
              >
                {t.start}
              </span>
            ))}
            <span>{timeline[timeline.length - 1].end}</span>
          </div>
        </>
      )}

      {/* Metrics */}
      {results.length > 0 && (
        <>
          <h3 className="rr-subtitle">Performance Metrics</h3>

          <table className="rr-table">
            <thead>
              <tr>
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

export default RoundRobinVisualizer;