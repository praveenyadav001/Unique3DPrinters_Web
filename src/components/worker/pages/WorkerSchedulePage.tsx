import { Calendar, Clock, Coffee, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function WorkerSchedulePage() {
  const { userProfile } = useAuth();
  
  const shiftStart = userProfile?.shift?.start || "09:00 AM";
  const shiftEnd = userProfile?.shift?.end || "06:00 PM";
  const shiftString = `${shiftStart} - ${shiftEnd}`;

  // Generate dynamic week schedule
  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 is Sunday
  
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const WEEK_SCHEDULE = daysOfWeek.map((dayName, index) => {
    // Generate dates for the current week (Sunday to Saturday)
    const date = new Date(today);
    date.setDate(today.getDate() - currentDayIndex + index);
    const dateStr = date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
    
    // Weekend logic (assume Sat/Sun are off)
    const isWeekend = index === 0 || index === 6;
    const isToday = index === currentDayIndex;
    const isPast = index < currentDayIndex;
    
    let status = "Scheduled";
    if (isWeekend) status = "Off";
    else if (isPast) status = "Present";
    else if (isToday) status = "Today";

    return {
      day: dayName,
      date: dateStr,
      status,
      shift: isWeekend ? "—" : shiftString,
      active: isToday,
    };
  });

  const TODAY_TIMELINE = [
    { time: shiftStart, label: "Shift Start", icon: <CheckCircle2 size={14} />, done: true },
    { time: "11:00 AM", label: "Morning Break", icon: <Coffee size={14} />, done: true },
    { time: "01:00 PM", label: "Lunch Break", icon: <Clock size={14} />, active: true },
    { time: "04:00 PM", label: "Afternoon Break", icon: <Coffee size={14} /> },
    { time: shiftEnd, label: "Shift End", icon: <Clock size={14} /> },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>My Schedule</h2>
        <p>View your upcoming shifts and daily timeline.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
        
        {/* Weekly Roster */}
        <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a", background: "rgba(var(--accent-rgb), 0.02)" }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar size={18} style={{ color: "var(--accent)" }} /> Weekly Roster
            </h3>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#888" }}>This Week</span>
          </div>
          
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem" }}>
            <thead>
              <tr>
                {["Day", "Date", "Shift Time", "Status"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "14px 20px", color: "#444", borderBottom: "1px solid #1a1a1a", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WEEK_SCHEDULE.map((day) => (
                <tr key={day.day} style={{ 
                  borderBottom: "1px solid #111",
                  background: day.active ? "rgba(var(--accent-rgb), 0.05)" : "transparent",
                  borderLeft: day.active ? "3px solid var(--accent)" : "3px solid transparent"
                }}>
                  <td style={{ padding: "14px 20px", color: day.active ? "var(--accent)" : "#ccc", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.95rem", fontWeight: day.active ? 700 : 600 }}>
                    {day.day}
                  </td>
                  <td style={{ padding: "14px 20px", color: "#888" }}>{day.date}</td>
                  <td style={{ padding: "14px 20px", color: day.shift === "—" ? "#444" : "#ccc" }}>{day.shift}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span className={`dash-badge ${
                      day.status === "Present" ? "dash-badge-green" : 
                      day.status === "Today" ? "dash-badge-accent" : 
                      day.status === "Scheduled" ? "dash-badge-blue" : "dash-badge-red"
                    }`}>
                      {day.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Today's Timeline */}
        <div className="dash-card">
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={18} style={{ color: "var(--accent)" }} /> Today's Timeline
          </h3>
          
          <div className="dash-timeline" style={{ flexDirection: "column", gap: 24, paddingLeft: 12 }}>
            {TODAY_TIMELINE.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, position: "relative" }}>
                {i < TODAY_TIMELINE.length - 1 && (
                  <div style={{ position: "absolute", left: 11, top: 24, bottom: -24, width: 2, background: item.done ? "var(--accent)" : "#222" }} />
                )}
                <div style={{ 
                  width: 24, height: 24, borderRadius: "50%", 
                  background: item.done ? "var(--accent)" : item.active ? "rgba(var(--accent-rgb), 0.2)" : "#111",
                  border: `2px solid ${item.done || item.active ? "var(--accent)" : "#333"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: item.done ? "#000" : item.active ? "var(--accent)" : "#555",
                  position: "relative", zIndex: 2
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, paddingBottom: i === TODAY_TIMELINE.length - 1 ? 0 : 8 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: item.active ? "var(--accent)" : "#666", marginBottom: 2 }}>{item.time}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: item.done ? "#888" : item.active ? "#fff" : "#ccc" }}>
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
