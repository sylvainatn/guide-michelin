import React, { forwardRef } from "react";
import { type ReservationDTO } from "@/lib/reservation/client";

interface Props {
  reservation: ReservationDTO;
}

export const InstagramStoryTemplate = forwardRef<HTMLDivElement, Props>(
  ({ reservation }, ref) => {
    const { restaurant } = reservation;
    const name = restaurant?.name || "Restaurant Inconnu";
    const bgImage = restaurant?.mainImageUrl || "/images/default-restaurant.png";
    const addressStr = restaurant?.address || "Adresse inconnue";
    const parts = addressStr.split(",");
    const city = parts[parts.length - 2]?.trim() || "";
    const country = parts[parts.length - 1]?.trim() || "France";
    const region = "Bordelais"; // Using a placeholder region or derive from data
    const locationStr = [city, region, country].filter(Boolean).join(" · ");
    const stars = restaurant?.stars || 1;

    return (
      <div
        ref={ref}
        style={{
          width: "1080px",
          height: "1920px",
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Dark Overlay for better text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.8))",
          }}
        />

        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: "100%" }}>
          {/* Top Logo Area */}
          <div style={{ marginTop: "160px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.43 4 16.05 4 12C4 7.95 7.05 4.57 11 4.07V19.93ZM13 4.07C16.95 4.57 20 7.95 20 12C20 16.05 16.95 19.43 13 19.93V4.07Z" fill="#E60000"/>
            </svg>
            <span style={{ fontSize: "28px", fontWeight: "bold", color: "#E60000", marginTop: "16px", letterSpacing: "2px" }}>LE GUIDE</span>
            <span style={{ fontSize: "42px", fontWeight: "900", color: "#E60000", letterSpacing: "4px" }}>MICHELIN</span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Center Info Area */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 60px", marginBottom: "400px" }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "110px", fontWeight: "bold", margin: "0", lineHeight: "1.1", textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
              {name}
            </h1>
            
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "32px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#E60000"/>
              </svg>
              <span style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: "36px", fontWeight: "bold", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                {locationStr}
              </span>
            </div>

            <div style={{ 
              marginTop: "48px", 
              padding: "24px 64px", 
              borderRadius: "100px", 
              border: "3px solid #E60000", 
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              backdropFilter: "blur(4px)"
            }}>
              <span style={{ fontSize: "40px", color: "white" }}>★</span>
              <span style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: "36px", fontWeight: "bold", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                {stars} Étoile{stars > 1 ? "s" : ""} Michelin
              </span>
            </div>
          </div>

          {/* Bottom Logo Area */}
          <div style={{ marginBottom: "120px" }}>
            <div style={{ width: "120px", height: "120px", borderRadius: "60px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM20 10C21.1 10 22 10.9 22 12C22 13.1 21.1 14 20 14C18.9 14 18 13.1 18 12C18 10.9 18.9 10 20 10ZM4 10C5.1 10 6 10.9 6 12C6 13.1 5.1 14 4 14C2.9 14 2 13.1 2 12C2 10.9 2.9 10 4 10ZM12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18ZM12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8Z" fill="#1A1A1A"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

InstagramStoryTemplate.displayName = "InstagramStoryTemplate";
