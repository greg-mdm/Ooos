import OooDashBoardForNewUser from "@/imports/🥘OooDashBoardForNewUser/🥘OooDashBoardForNewUser";

export default function App() {
  return (
    <div
      className="overflow-x-auto overflow-y-auto"
      style={{ minHeight: "100vh", backgroundColor: "#f0f4f5" }}
    >
      <div
        style={{
          position: "relative",
          width: "1440px",
          height: "2450px",
          margin: "0 auto",
        }}
      >
        <OooDashBoardForNewUser />
      </div>
    </div>
  );
}
