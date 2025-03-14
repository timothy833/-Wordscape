import ClipLoader from "react-spinners/ClipLoader";

function LoadingSpinner() {
  return (
    <>
      <div style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        backgroundColor: "rgba(255,255,255,0.5)",
        backdropFilter: "blur(2px)"
      }}>
        <ClipLoader
          color={"#000000"}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </>
  )
}

export default LoadingSpinner