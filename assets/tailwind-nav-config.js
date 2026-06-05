tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-background": "#e3e2e2",
        "on-surface": "#e3e2e2",
        "void-black": "#050505",
        "on-surface-variant": "#c4c7c7",
        surface: "#121414",
        "electric-cyan": "#00F0FF",
        "nebula-purple": "#7000FF",
        "starlight-white": "#FFFFFF",
        outline: "#8e9192",
        "on-primary-container": "#797777"
      },
      spacing: {
        "margin-desktop": "64px",
        "margin-mobile": "20px",
        gutter: "24px",
        "container-max": "1440px"
      },
      fontFamily: {
        "label-mono": ["JetBrains Mono"],
        "label-caps": ["JetBrains Mono"],
        "headline-md": ["Space Grotesk"]
      },
      fontSize: {
        "label-mono": ["14px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500" }],
        "label-caps": ["12px", { lineHeight: "1.2", letterSpacing: "0.1em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "500" }]
      }
    }
  }
};
