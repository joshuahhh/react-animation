import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./missing.min.css";
// must come after missing.min.css
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
