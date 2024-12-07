import axios from "axios";
export default function Test() {
  const handleDownload = async () => {
    const res = await fetch("http://127.0.0.1:8000/download");
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bookings.csv"; // File name for the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      <button onClick={handleDownload}>Download</button>
    </>
  );
}
