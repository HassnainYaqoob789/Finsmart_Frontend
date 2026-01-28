import { Row, Spin } from "antd";
import { Users, TrendingUp, Activity } from "lucide-react";
import useLanguage from "@/locale/useLanguage";

export default function CustomerPreviewCard({
  isLoading = false,
  activeCustomer = 0,
  newCustomer = 0,
}) {
  const translate = useLanguage();

  const circumference = 2 * Math.PI * 70;
  const progress = (newCustomer / 100) * circumference;

  return (
    <Row className="gutter-row" style={{ width: "100%" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
          borderRadius: "16px",
          padding: "28px 24px",
          minHeight: "458px", // ✅ fixed, matches other cards
          // maxHeight: "458px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxShadow: "0 10px 30px rgba(102, 126, 234, 0.25)",
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow =
            "0 12px 36px rgba(102, 126, 234, 0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 10px 30px rgba(102, 126, 234, 0.25)";
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "220px",
            height: "220px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            filter: "blur(45px)",
          }}
        />

        <div
          style={{
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
              backdropFilter: "blur(10px)",
            }}
          >
            <Users size={32} color="white" />
          </div>

          <h3
            style={{
              color: "white",
              marginBottom: "36px",
              fontSize: "22px",
              fontWeight: "700",
            }}
          >
            {translate("Customers")}
          </h3>

          {isLoading ? (
            <Spin size="large" />
          ) : (
            <div>
              {/* Circular Progress */}
              <div
                style={{
                  position: "relative",
                  width: "150px",
                  height: "150px",
                  margin: "0 auto 22px",
                }}
              >
                <svg
                  width="150"
                  height="150"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <circle
                    cx="75"
                    cy="75"
                    r="65"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="75"
                    cy="75"
                    r="65"
                    fill="none"
                    stroke="white"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    style={{
                      transition: "stroke-dashoffset 1s ease",
                      filter:
                        "drop-shadow(0 0 8px rgba(255,255,255,0.5))",
                    }}
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    fontSize: "30px",
                    fontWeight: "700",
                  }}
                >
                  {newCustomer}%
                </div>
              </div>

              <p
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "14px",
                  marginBottom: "28px",
                  fontWeight: "500",
                }}
              >
                {translate("New Customers this Month")}
              </p>

              {/* Active Customer Stats */}
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "12px",
                  padding: "18px 20px",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Activity
                    size={18}
                    color="white"
                    style={{ marginRight: "8px" }}
                  />
                  <span
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    {translate("Active Customers")}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {activeCustomer !== 0 && (
                    <TrendingUp
                      size={22}
                      color="white"
                      style={{
                        transform:
                          activeCustomer < 0 ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                  <span
                    style={{
                      color: "white",
                      fontSize: "26px",
                      fontWeight: "700",
                    }}
                  >
                    {activeCustomer.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Row>
  );
}
