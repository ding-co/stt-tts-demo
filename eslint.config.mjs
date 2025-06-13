import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

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

      // react 관련 규칙
      "react/react-in-jsx-scope": "off",
      "react/no-children-prop": "off",
      "react/no-unknown-property": "off",

      // TypeScript 관련 규칙
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",

      // 기타 규칙
      "no-useless-escape": "warn",
      "no-empty-pattern": "warn",
    },
  },
];

export default eslintConfig;
