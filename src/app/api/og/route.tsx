import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "CONEX & DON";
  const description =
    searchParams.get("description") ?? "L'héritage en mouvement — Duo musical béninois";
  const type = searchParams.get("type") ?? "default";
  const image = searchParams.get("image");

  const bgColor = "#080808";
  const textColor = "#F5F2EA";
  const accentColor = "#D6A83A";

  const typeConfig: Record<string, { label: string; color: string }> = {
    album: { label: "ALBUM", color: "#6F4A32" },
    ep: { label: "EP", color: "#173F32" },
    single: { label: "SINGLE", color: "#9E382C" },
    live: { label: "CONCERT & LIVE", color: "#173F32" },
    video: { label: "CLIP VIDÉO", color: "#6F4A32" },
    article: { label: "PRESSE", color: "#D6A83A" },
    news: { label: "ACTUALITÉ", color: "#D6A83A" },
  };

  const badgeInfo = typeConfig[type.toLowerCase()] ?? {
    label: type !== "default" ? type.toUpperCase() : "SITE OFFICIEL",
    color: accentColor,
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200",
          height: "630",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bgColor,
          backgroundImage: `
            radial-gradient(ellipse at 20% 20%, rgba(214, 168, 58, 0.18) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(111, 74, 50, 0.20) 0%, transparent 50%)
          `,
          fontFamily: "sans-serif",
          color: textColor,
          padding: "60px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.18,
              zIndex: 0,
            }}
          />
        )}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: "960px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "28px",
              padding: "8px 24px",
              backgroundColor: "rgba(245, 242, 234, 0.08)",
              border: `1px solid ${accentColor}`,
              borderRadius: "9999px",
            }}
          >
            <span
              style={{
                fontSize: "15px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: accentColor,
                fontWeight: 700,
              }}
            >
              CONEX &amp; DON
            </span>
            {badgeInfo.label && (
              <span
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: badgeInfo.color,
                  backgroundColor: "rgba(245, 242, 234, 0.12)",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontWeight: 600,
                }}
              >
                {badgeInfo.label}
              </span>
            )}
          </div>

          <h1
            style={{
              fontSize: title.length > 30 ? "54px" : "72px",
              lineHeight: "1.05",
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              marginBottom: "20px",
              fontWeight: 800,
              color: "#FFFFFF",
              textShadow: "0 4px 30px rgba(0,0,0,0.6)",
              display: "flex",
              textAlign: "center",
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: "22px",
              lineHeight: "1.45",
              color: "rgba(245, 242, 234, 0.85)",
              marginBottom: "36px",
              maxWidth: "760px",
              textAlign: "center",
            }}
          >
            {description}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "18px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(245, 242, 234, 0.15)",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(245, 242, 234, 0.65)",
                fontWeight: 600,
              }}
            >
              conexetdon.com
            </span>
            <div style={{ width: "40px", height: "1px", backgroundColor: accentColor }} />
            <span
              style={{
                fontSize: "13px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(245, 242, 234, 0.65)",
                fontWeight: 600,
              }}
            >
              @conexetdon
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    },
  );
}
