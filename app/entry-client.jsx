import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import "./globals.css";
const config = JSON.parse(document.getElementById("site-config").textContent);
hydrateRoot(document, <BrowserRouter><App config={config} /></BrowserRouter>);
