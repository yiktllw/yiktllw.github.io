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
declare module "nprogress" {
  const NProgress: {
    start: () => void;
    done: () => void;
    configure: (options: { [key: string]: any }) => void;
  };
  export default NProgress;
}
