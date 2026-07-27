import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.node,
                GameLogic: "writable",
                CameraHandler: "writable",
                PLAYMAT_COORDINATES: "readonly",
                FOCUS_ZONES: "readonly",
                ALL_AVAILABLE_CARDS: "readonly",
                extractScoreNumber: "readonly",
                findClosestCard: "readonly",
                matchCardsInZone: "readonly",
                Tesseract: "readonly",
                html2canvas: "readonly"
            },
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "warn"
        }
    }
];
