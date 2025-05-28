import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // React Hooks 관련 규칙
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",

      // TypeScript 관련 규칙
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",

      // react 관련 규칙
      "react/no-children-prop": "off",
      "react/no-unknown-property": "off",
      "react/react-in-jsx-scope": "off",

      // 기타 규칙
      "no-useless-escape": "warn",
      "no-empty-pattern": "warn",
    },
  },
];

export default eslintConfig;
