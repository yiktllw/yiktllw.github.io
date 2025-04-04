interface Window {
  theme?: "light" | "dark";
  mermaid?: {
    run: () => void;
    initialize: (a: {
      startOnLoad: boolean;
      theme: "dark" | "default" | "neutral" | "forest";
    }) => void;
  };
}
