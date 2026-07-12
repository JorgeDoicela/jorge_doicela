import js from "@eslint/js";
import ts from "typescript-eslint";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "dist/**"]
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-undef": "off"
    }
  }
];

export default eslintConfig;
