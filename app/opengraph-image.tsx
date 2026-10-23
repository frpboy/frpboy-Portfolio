import { ImageResponse } from "next/og";

export const alt = "Rahul Muraleedharan — Full Stack Developer and Automation Specialist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "68px", background: "#050706", color: "#ffffff", fontFamily: "sans-serif", border: "1px solid #163e31" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "#00ff9c", fontSize: 22, letterSpacing: "0.22em" }}>
          <span style={{ width: 12, height: 12, borderRadius: 20, background: "#00ff9c" }} />
          PORTFOLIO OS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 66, fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.055em" }}>Rahul Muraleedharan</div>
          <div style={{ display: "flex", fontSize: 30, color: "#00ff9c", letterSpacing: "-0.025em" }}>Full Stack Developer &amp; Automation Specialist</div>
          <div style={{ display: "flex", fontSize: 22, lineHeight: 1.45, color: "#a6b1ac", maxWidth: 880 }}>Practical software, evidence-led troubleshooting, and repeatable workflows.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#63736b", fontSize: 18, letterSpacing: "0.12em" }}>
          <span>WEB · DESKTOP · AUTOMATION</span><span>FRPBOY.IN</span>
        </div>
      </div>
    ),
    size
  );
}
