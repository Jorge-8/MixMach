import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // semi: "error",

      // Hooks deben empezar con "use"
      //hook, es una funcion especial de react
      "react-hooks/rules-of-hooks": "error",

      // Variables sin usar → error
      "@typescript-eslint/no-unused-vars": "error",
      // Prohibir el tipo any explícito
      "@typescript-eslint/no-explicit-any": "warn",
      // Preferir-const cuando la variable no se reasigna, indica que la variable nunca se reasigna
      "prefer-const": "error",
      // Sin console.log en código (RQ-09 / buenas prácticas)
      "no-console": "warn",
      // Sin variables declaradas pero no usadas
      "no-unused-vars": "off", // apagada porque la maneja @typescript-eslint
      // Self-closing en componentes sin hijos
      "react/self-closing-comp": "warn",
      // Siempre usar === en vez de ==
      "eqeqeq": "error",
      // Sin código inalcanzable, o codigo que nunca se ejecuta
      "no-unreachable": "error",
      // Prohibir hardcodear strings que parecen secretos, detecta si se pone infromacion sensible
      "no-secrets/no-secrets": "off",
    },
  },
]);

export default eslintConfig;
