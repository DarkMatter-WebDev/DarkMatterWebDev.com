tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {"screens":{"md":"880px"},
      colors: {
        "white": "rgb(var(--t-starlight-white) / <alpha-value>)",
        "on-background": "rgb(var(--t-on-background) / <alpha-value>)",
        "on-surface": "rgb(var(--t-on-surface) / <alpha-value>)",
        "void-black": "rgb(var(--t-void-black) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--t-on-surface-variant) / <alpha-value>)",
        surface: "rgb(var(--t-surface) / <alpha-value>)",
        "electric-cyan": "rgb(var(--t-electric-cyan) / <alpha-value>)",
        "nebula-purple": "rgb(var(--t-nebula-purple) / <alpha-value>)",
        "starlight-white": "rgb(var(--t-starlight-white) / <alpha-value>)",
        outline: "rgb(var(--t-outline) / <alpha-value>)",
        "on-primary-container": "rgb(var(--t-on-primary-container) / <alpha-value>)"
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
